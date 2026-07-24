"""One-off script: generates static/gadtube.ico from scratch (no source
image to convert). Re-run manually (`python -m tools.create_icon`) whenever
the design changes; the output is committed to the repo like any other
static asset, and reused both as the Windows shortcut icon and the browser
favicon."""
from pathlib import Path

from PIL import Image, ImageDraw

BACKGROUND = (15, 15, 20)
ACCENT = (255, 0, 51)
NOTE = (255, 255, 255)

OUTPUT_PATH = Path(__file__).resolve().parent.parent / 'static' / 'gadtube.ico'
SIZES = [16, 24, 32, 48, 64, 128, 256]


def draw_icon(size):
    image = Image.new('RGBA', (size, size), BACKGROUND + (255,))
    draw = ImageDraw.Draw(image)

    margin = size * 0.22
    triangle = [
        (margin, margin),
        (margin, size - margin),
        (size * 0.55, size / 2),
    ]
    draw.polygon(triangle, fill=ACCENT + (255,))

    note_head_r = size * 0.10
    note_cx, note_cy = size * 0.72, size * 0.68
    draw.ellipse(
        [note_cx - note_head_r, note_cy - note_head_r, note_cx + note_head_r, note_cy + note_head_r],
        fill=NOTE + (255,),
    )
    stem_width = max(1, round(size * 0.045))
    draw.rectangle(
        [note_cx + note_head_r - stem_width, size * 0.20, note_cx + note_head_r, note_cy],
        fill=NOTE + (255,),
    )

    return image


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    images = [draw_icon(s) for s in SIZES]
    largest = images[-1]
    largest.save(
        OUTPUT_PATH,
        format='ICO',
        sizes=[(s, s) for s in SIZES],
        append_images=images[:-1],
    )
    print(f'Wrote {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
