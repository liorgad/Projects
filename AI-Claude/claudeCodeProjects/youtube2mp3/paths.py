import os
import sys
from pathlib import Path

APP_NAME = 'GadTube'


def is_frozen():
    return getattr(sys, 'frozen', False)


def get_data_dir():
    """Root directory for downloads/ and logs/.

    Installed (frozen) mode uses the shared ProgramData location, since the
    app runs as a single service for every Windows account. Dev mode keeps
    using the folder this file lives in, so `python app.py` needs no setup.
    """
    if is_frozen():
        base = Path(os.environ.get('PROGRAMDATA', r'C:\ProgramData')) / APP_NAME
    else:
        base = Path(__file__).resolve().parent
    base.mkdir(parents=True, exist_ok=True)
    return base


def get_bin_path(name):
    """Resolve the path to an external tool (ffmpeg, yt-dlp).

    Installed mode: the tool ships as a sibling file next to the frozen exe,
    since a target machine has no Python and nothing on PATH for us to find.
    Dev mode: fall back to the bare command name, assumed to be on PATH.
    """
    if is_frozen():
        exe_dir = Path(sys.executable).resolve().parent
        return str(exe_dir / f'{name}.exe')
    return name


def resource_path(relative_path):
    """Resolve a path to bundled resources (templates/, static/).

    PyInstaller extracts data files to a temp dir at runtime, exposed via
    sys._MEIPASS. Dev mode just resolves relative to this file's directory.
    """
    if is_frozen():
        base = Path(getattr(sys, '_MEIPASS'))
    else:
        base = Path(__file__).resolve().parent
    return str(base / relative_path)
