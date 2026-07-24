import json
import os
import re
import subprocess

from flask import Flask, request, jsonify, render_template, send_file
from waitress import serve

import activity_log
import config
import paths

YOUTUBE_ID_RE = re.compile(r'^[A-Za-z0-9_-]{11}$')

app = Flask(
    __name__,
    template_folder=paths.resource_path('templates'),
    static_folder=paths.resource_path('static'),
)

DATA_DIR = paths.get_data_dir()
DOWNLOADS_DIR = os.path.join(DATA_DIR, 'downloads')
os.makedirs(DOWNLOADS_DIR, exist_ok=True)

LOGGER = activity_log.setup_logger(os.path.join(DATA_DIR, 'logs'))

FFMPEG_PATH = paths.get_bin_path('ffmpeg')
YTDLP_PATH = paths.get_bin_path('yt-dlp')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/search')
def search():
    q = request.args.get('q', '').strip()
    if not q:
        return jsonify({'items': []})

    cmd = [
        YTDLP_PATH,
        f'ytsearch24:{q}',
        '--dump-json',
        '--no-download',
        '--flat-playlist',
        '--no-warnings',
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode != 0 and not result.stdout.strip():
            error = result.stderr or 'Search failed'
            activity_log.log_search(LOGGER, q, error=error)
            return jsonify({'error': error}), 500
    except subprocess.TimeoutExpired:
        activity_log.log_search(LOGGER, q, error='Search timed out')
        return jsonify({'error': 'Search timed out'}), 500
    except FileNotFoundError:
        error = 'yt-dlp not found. Run: pip install yt-dlp'
        activity_log.log_search(LOGGER, q, error=error)
        return jsonify({'error': error}), 500

    items = []
    for line in result.stdout.splitlines():
        if not line.strip():
            continue
        try:
            entry = json.loads(line)
        except json.JSONDecodeError:
            continue

        video_id = entry.get('id', '')
        if not video_id or not YOUTUBE_ID_RE.match(video_id):
            continue

        # Fall back to the standard YouTube thumbnail URL if yt-dlp omits one
        thumbnail = entry.get('thumbnail') or f'https://i.ytimg.com/vi/{video_id}/mqdefault.jpg'

        # Normalize to the same shape the frontend already expects
        items.append({
            'id': {'videoId': video_id},
            'snippet': {
                'title': entry.get('title', ''),
                'channelTitle': entry.get('channel') or entry.get('uploader', ''),
                'description': entry.get('description', ''),
                'thumbnails': {'medium': {'url': thumbnail}},
            },
        })

    activity_log.log_search(LOGGER, q, result_count=len(items))
    return jsonify({'items': items})


@app.route('/api/download')
def download():
    video_id = request.args.get('video_id', '').strip()
    title = request.args.get('title', video_id).strip()

    if not video_id or not YOUTUBE_ID_RE.match(video_id):
        return jsonify({'error': 'invalid video_id'}), 400

    output_path = os.path.join(DOWNLOADS_DIR, f'{video_id}.mp3')

    # Confirm the resolved path stays inside DOWNLOADS_DIR (defense-in-depth)
    real_downloads = os.path.realpath(DOWNLOADS_DIR)
    real_output = os.path.realpath(output_path)
    if not real_output.startswith(real_downloads + os.sep):
        return jsonify({'error': 'invalid path'}), 400

    if not os.path.exists(output_path):
        url = f'https://www.youtube.com/watch?v={video_id}'
        cmd = [
            YTDLP_PATH,
            '-x',
            '--audio-format', 'mp3',
            '--audio-quality', '0',
            '--ffmpeg-location', FFMPEG_PATH,
            '-o', os.path.join(DOWNLOADS_DIR, '%(id)s.%(ext)s'),
            '--no-playlist',
            url,
        ]
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
            if result.returncode != 0:
                error = result.stderr or 'yt-dlp failed'
                activity_log.log_download(LOGGER, video_id, title, error=error)
                return jsonify({'error': error}), 500
        except subprocess.TimeoutExpired:
            activity_log.log_download(LOGGER, video_id, title, error='Download timed out after 5 minutes')
            return jsonify({'error': 'Download timed out after 5 minutes'}), 500
        except FileNotFoundError:
            error = 'yt-dlp not found. Run: pip install yt-dlp'
            activity_log.log_download(LOGGER, video_id, title, error=error)
            return jsonify({'error': error}), 500

    if not os.path.exists(output_path):
        activity_log.log_download(LOGGER, video_id, title, error='File not found after download')
        return jsonify({'error': 'File not found after download'}), 500

    activity_log.log_download(LOGGER, video_id, title)

    safe_title = ''.join(c for c in title if c.isalnum() or c in ' -_').strip() or video_id
    return send_file(
        output_path,
        as_attachment=True,
        download_name=f'{safe_title}.mp3',
        mimetype='audio/mpeg',
    )


if __name__ == '__main__':
    port = config.load_port(os.path.join(DATA_DIR, 'config.ini'))
    print(f'GadTube running at http://localhost:{port}')
    serve(app, host='127.0.0.1', port=port)
