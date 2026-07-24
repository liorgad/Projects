import sys

import paths


def test_get_data_dir_dev_mode_uses_module_directory(monkeypatch, tmp_path):
    monkeypatch.delattr(sys, 'frozen', raising=False)
    monkeypatch.setattr(paths, '__file__', str(tmp_path / 'paths.py'))

    result = paths.get_data_dir()

    assert result == tmp_path


def test_get_data_dir_frozen_mode_uses_programdata(monkeypatch, tmp_path):
    monkeypatch.setattr(sys, 'frozen', True, raising=False)
    monkeypatch.setenv('PROGRAMDATA', str(tmp_path))

    result = paths.get_data_dir()

    assert result == tmp_path / 'GadTube'
    assert result.exists()


def test_get_bin_path_dev_mode_returns_bare_name(monkeypatch):
    monkeypatch.delattr(sys, 'frozen', raising=False)

    assert paths.get_bin_path('ffmpeg') == 'ffmpeg'


def test_get_bin_path_frozen_mode_returns_sibling_exe(monkeypatch, tmp_path):
    monkeypatch.setattr(sys, 'frozen', True, raising=False)
    fake_exe = tmp_path / 'GadTube.exe'
    monkeypatch.setattr(sys, 'executable', str(fake_exe))

    assert paths.get_bin_path('ffmpeg') == str(tmp_path / 'ffmpeg.exe')


def test_resource_path_dev_mode_resolves_relative_to_module(monkeypatch, tmp_path):
    monkeypatch.delattr(sys, 'frozen', raising=False)
    monkeypatch.setattr(paths, '__file__', str(tmp_path / 'paths.py'))

    assert paths.resource_path('templates') == str(tmp_path / 'templates')


def test_resource_path_frozen_mode_resolves_relative_to_meipass(monkeypatch, tmp_path):
    monkeypatch.setattr(sys, 'frozen', True, raising=False)
    monkeypatch.setattr(sys, '_MEIPASS', str(tmp_path), raising=False)

    assert paths.resource_path('templates') == str(tmp_path / 'templates')
