from PIL import IcoImagePlugin

from tools import create_icon


def test_main_generates_multi_size_ico(tmp_path, monkeypatch):
    output_path = tmp_path / 'gadtube.ico'
    monkeypatch.setattr(create_icon, 'OUTPUT_PATH', output_path)

    create_icon.main()

    assert output_path.exists()
    with open(output_path, 'rb') as f:
        ico_file = IcoImagePlugin.IcoFile(f)
        sizes = ico_file.sizes()
        assert (256, 256) in sizes
        assert (16, 16) in sizes
