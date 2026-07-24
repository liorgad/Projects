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


def test_main_16px_frame_renders_accent_color_without_dilution(tmp_path, monkeypatch):
    output_path = tmp_path / 'gadtube.ico'
    monkeypatch.setattr(create_icon, 'OUTPUT_PATH', output_path)

    create_icon.main()

    with open(output_path, 'rb') as f:
        ico_file = IcoImagePlugin.IcoFile(f)
        frame_16 = ico_file.getimage((16, 16))
        # (8, 8) sits near the triangle's pointed tip at this size (verified
        # by inspection) -- the thin tip is where LANCZOS downsampling from
        # a single 256px master visibly dilutes the color, so this is the
        # coordinate that actually distinguishes native per-size rendering
        # from the old buggy downsample-only behavior. Sample the pixel
        # while the underlying file is still open (the frame image loads
        # lazily).
        r, g, b, a = frame_16.convert('RGBA').getpixel((8, 8))
    assert abs(r - create_icon.ACCENT[0]) < 15
    assert abs(g - create_icon.ACCENT[1]) < 15
    assert abs(b - create_icon.ACCENT[2]) < 15
