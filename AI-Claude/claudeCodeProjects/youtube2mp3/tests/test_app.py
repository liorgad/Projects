import json
from unittest.mock import MagicMock

import pytest

import app as app_module


@pytest.fixture
def client():
    app_module.app.testing = True
    return app_module.app.test_client()


def test_search_logs_result_count_on_success(client, monkeypatch):
    fake_result = MagicMock(
        returncode=0,
        stdout=json.dumps({
            'id': 'dQw4w9WgXcQ',
            'title': 'Never Gonna Give You Up',
            'channel': 'Rick Astley',
        }) + '\n',
        stderr='',
    )
    monkeypatch.setattr(app_module.subprocess, 'run', lambda *a, **k: fake_result)
    log_spy = MagicMock()
    monkeypatch.setattr(app_module.activity_log, 'log_search', log_spy)

    response = client.get('/api/search?q=never+gonna')

    assert response.status_code == 200
    assert len(response.get_json()['items']) == 1
    log_spy.assert_called_once_with(app_module.LOGGER, 'never gonna', result_count=1)


def test_search_logs_error_when_yt_dlp_missing(client, monkeypatch):
    def raise_not_found(*args, **kwargs):
        raise FileNotFoundError()

    monkeypatch.setattr(app_module.subprocess, 'run', raise_not_found)
    log_spy = MagicMock()
    monkeypatch.setattr(app_module.activity_log, 'log_search', log_spy)

    response = client.get('/api/search?q=test')

    assert response.status_code == 500
    log_spy.assert_called_once()
    assert log_spy.call_args.kwargs['error'].startswith('yt-dlp not found')


def test_download_logs_ok_on_cached_file(client, monkeypatch, tmp_path):
    monkeypatch.setattr(app_module, 'DOWNLOADS_DIR', str(tmp_path))
    (tmp_path / 'dQw4w9WgXcQ.mp3').write_bytes(b'fake mp3 data')
    log_spy = MagicMock()
    monkeypatch.setattr(app_module.activity_log, 'log_download', log_spy)

    response = client.get('/api/download?video_id=dQw4w9WgXcQ&title=Test')

    assert response.status_code == 200
    log_spy.assert_called_once_with(app_module.LOGGER, 'dQw4w9WgXcQ', 'Test')


def test_download_logs_error_on_yt_dlp_failure(client, monkeypatch, tmp_path):
    monkeypatch.setattr(app_module, 'DOWNLOADS_DIR', str(tmp_path))
    fake_result = MagicMock(returncode=1, stderr='yt-dlp exploded')
    monkeypatch.setattr(app_module.subprocess, 'run', lambda *a, **k: fake_result)
    log_spy = MagicMock()
    monkeypatch.setattr(app_module.activity_log, 'log_download', log_spy)

    response = client.get('/api/download?video_id=dQw4w9WgXcQ&title=Test')

    assert response.status_code == 500
    log_spy.assert_called_once_with(app_module.LOGGER, 'dQw4w9WgXcQ', 'Test', error='yt-dlp exploded')


def test_index_page_includes_favicon_link(client):
    response = client.get('/')

    assert b'gadtube.ico' in response.data


def test_download_logs_error_on_invalid_video_id(client, monkeypatch, tmp_path):
    monkeypatch.setattr(app_module, 'DOWNLOADS_DIR', str(tmp_path))
    log_spy = MagicMock()
    monkeypatch.setattr(app_module.activity_log, 'log_download', log_spy)

    response = client.get('/api/download?video_id=not-valid&title=Test')

    assert response.status_code == 400
    log_spy.assert_called_once_with(app_module.LOGGER, 'not-valid', 'Test', error='invalid video_id')


def test_download_logs_error_on_path_traversal_attempt(client, monkeypatch, tmp_path):
    monkeypatch.setattr(app_module, 'DOWNLOADS_DIR', str(tmp_path))
    log_spy = MagicMock()
    monkeypatch.setattr(app_module.activity_log, 'log_download', log_spy)
    # Force the realpath check to fail regardless of video_id, simulating a
    # resolved path that escapes DOWNLOADS_DIR.
    monkeypatch.setattr(app_module.os.path, 'realpath', lambda p: 'C:\\somewhere\\else')

    response = client.get('/api/download?video_id=dQw4w9WgXcQ&title=Test')

    assert response.status_code == 400
    log_spy.assert_called_once_with(app_module.LOGGER, 'dQw4w9WgXcQ', 'Test', error='invalid path')


def test_download_uses_resolved_ytdlp_and_ffmpeg_paths(client, monkeypatch, tmp_path):
    monkeypatch.setattr(app_module, 'DOWNLOADS_DIR', str(tmp_path))
    captured_cmd = {}

    def fake_run(cmd, **kwargs):
        captured_cmd['cmd'] = cmd
        (tmp_path / 'dQw4w9WgXcQ.mp3').write_bytes(b'fake mp3 data')
        return MagicMock(returncode=0, stderr='')

    monkeypatch.setattr(app_module.subprocess, 'run', fake_run)
    monkeypatch.setattr(app_module.activity_log, 'log_download', MagicMock())

    client.get('/api/download?video_id=dQw4w9WgXcQ&title=Test')

    assert app_module.YTDLP_PATH in captured_cmd['cmd']
    assert app_module.FFMPEG_PATH in captured_cmd['cmd']
    assert '--ffmpeg-location' in captured_cmd['cmd']


def test_search_uses_resolved_ytdlp_path(client, monkeypatch):
    captured_cmd = {}

    def fake_run(cmd, **kwargs):
        captured_cmd['cmd'] = cmd
        return MagicMock(returncode=0, stdout='', stderr='')

    monkeypatch.setattr(app_module.subprocess, 'run', fake_run)
    monkeypatch.setattr(app_module.activity_log, 'log_search', MagicMock())

    client.get('/api/search?q=test')

    assert app_module.YTDLP_PATH in captured_cmd['cmd']
