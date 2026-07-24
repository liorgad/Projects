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


def test_16px_frame_renders_accent_color_without_dilution():
    icon = create_icon.draw_icon(16)
    # (4, 8) sits inside the triangle at this size (verified by inspection),
    # given the 0.22 margin used by draw_icon.
    r, g, b, a = icon.getpixel((4, 8))
    assert abs(r - create_icon.ACCENT[0]) < 15
    assert abs(g - create_icon.ACCENT[1]) < 15
    assert abs(b - create_icon.ACCENT[2]) < 15
