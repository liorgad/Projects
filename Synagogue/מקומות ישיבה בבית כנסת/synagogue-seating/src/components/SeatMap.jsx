import { useRef, useState } from 'react';
import { STATUS_META } from '../data/seatLayout';

const SEAT_SIZE = 26;
const SEAT_GAP = 6;
const ROW_GAP = 8;
const BLOCK_GAP = 48;
const BLOCK_TITLE_HEIGHT = 34;
const TOP_PADDING = 16;
const SIDE_PADDING = 16;
const ROW_LABEL_WIDTH = 22;
const DRAG_THRESHOLD = 4;

function seatPosition(seat) {
  if (seat.posX != null && seat.posY != null) {
    return { x: seat.posX, y: seat.posY, custom: true };
  }
  return {
    x: ROW_LABEL_WIDTH + (seat.col - 1) * (SEAT_SIZE + SEAT_GAP),
    y: (seat.row - 1) * (SEAT_SIZE + ROW_GAP),
    custom: false,
  };
}

function computeBlockBounds(block) {
  let maxX = ROW_LABEL_WIDTH + SEAT_SIZE;
  let maxY = SEAT_SIZE;
  let minX = 0;
  let minY = 0;
  block.seats.forEach((seat) => {
    const { x, y } = seatPosition(seat);
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + SEAT_SIZE);
    maxY = Math.max(maxY, y + SEAT_SIZE);
  });
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}

export default function SeatMap({ blocks, selectedSeatId, editMode, onSeatClick, onSeatMove, onAddSeat }) {
  const svgRef = useRef(null);
  const dragRef = useRef(null);
  const [liveDrag, setLiveDrag] = useState(null); // { seatId, x, y }

  const bounds = blocks.map(computeBlockBounds);
  const totalWidth =
    bounds.reduce((sum, b) => sum + b.width, 0) + BLOCK_GAP * Math.max(0, blocks.length - 1) + SIDE_PADDING * 2;
  const maxHeight = Math.max(...bounds.map((b) => b.height), SEAT_SIZE);
  const totalHeight = TOP_PADDING + BLOCK_TITLE_HEIGHT + maxHeight + TOP_PADDING;

  let cursorX = SIDE_PADDING;
  const blockOffsets = blocks.map((_, i) => {
    const x = cursorX;
    cursorX += bounds[i].width + BLOCK_GAP;
    return x;
  });

  function toLocalPoint(target, clientX, clientY) {
    const ctm = target.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const pt = svgRef.current.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const local = pt.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }

  function handleSeatPointerDown(e, seat) {
    e.stopPropagation();
    if (!editMode) {
      onSeatClick(seat);
      return;
    }
    const pos = seatPosition(seat);
    dragRef.current = {
      seatId: seat.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
    };
    e.target.setPointerCapture(e.pointerId);
  }

  function handleSeatPointerMove(e) {
    const drag = dragRef.current;
    if (!drag) return;
    const dxScreen = e.clientX - drag.startClientX;
    const dyScreen = e.clientY - drag.startClientY;
    if (Math.hypot(dxScreen, dyScreen) > DRAG_THRESHOLD) drag.moved = true;
    if (!drag.moved) return;

    // המרת תזוזת עכבר במסך ליחידות SVG פנימיות לפי קנה המידה הנוכחי
    const rect = svgRef.current.getBoundingClientRect();
    const scale = totalWidth / rect.width;
    const x = drag.origX + dxScreen * scale;
    const y = drag.origY + dyScreen * scale;
    setLiveDrag({ seatId: drag.seatId, x, y });
  }

  function handleSeatPointerUp(e, seat) {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    if (!drag.moved) {
      onSeatClick(seat);
      setLiveDrag(null);
      return;
    }
    const rect = svgRef.current.getBoundingClientRect();
    const scale = totalWidth / rect.width;
    const dxScreen = e.clientX - drag.startClientX;
    const dyScreen = e.clientY - drag.startClientY;
    const x = Math.round(drag.origX + dxScreen * scale);
    const y = Math.round(drag.origY + dyScreen * scale);
    setLiveDrag(null);
    onSeatMove(drag.seatId, x, y);
  }

  function handleBlockBgClick(e, block) {
    if (!editMode) return;
    const { x, y } = toLocalPoint(e.currentTarget, e.clientX, e.clientY);
    onAddSeat(block.id, Math.round(x - SEAT_SIZE / 2), Math.round(y - SEAT_SIZE / 2));
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className={`seatmap-svg ${editMode ? 'seatmap-edit-mode' : ''}`}
      role="img"
      aria-label="מפת מקומות ישיבה"
    >
      <text x={totalWidth / 2} y={TOP_PADDING + 10} textAnchor="middle" className="seatmap-front-label">
        ↓ לכיוון ארון הקודש / הבימה ↓
      </text>

      {blocks.map((block, bi) => {
        const bx = blockOffsets[bi] - bounds[bi].minX;
        const by = TOP_PADDING + BLOCK_TITLE_HEIGHT - bounds[bi].minY;
        return (
          <g key={block.id} transform={`translate(${bx}, ${by})`}>
            <text
              x={bounds[bi].minX + bounds[bi].width / 2}
              y={bounds[bi].minY - 10}
              textAnchor="middle"
              className="seatmap-block-title"
            >
              {block.title}
              {editMode ? ' (לחיצה על שטח ריק מוסיפה מקום)' : ''}
            </text>

            {editMode && (
              <rect
                x={bounds[bi].minX - 10}
                y={bounds[bi].minY - 4}
                width={bounds[bi].width + 20}
                height={bounds[bi].height + 14}
                fill="transparent"
                className="seatmap-block-bg"
                onClick={(e) => handleBlockBgClick(e, block)}
              />
            )}

            {block.seats.map((seat) => {
              const meta = STATUS_META[seat.status];
              const base = seatPosition(seat);
              const live = liveDrag && liveDrag.seatId === seat.id ? liveDrag : null;
              const x = live ? live.x : base.x;
              const y = live ? live.y : base.y;
              const isSelected = seat.id === selectedSeatId;
              return (
                <g key={seat.id}>
                  {!base.custom && seat.col === 1 && (
                    <text
                      x={ROW_LABEL_WIDTH - 8}
                      y={y + SEAT_SIZE / 2 + 4}
                      textAnchor="end"
                      className="seatmap-row-label"
                    >
                      {seat.row}
                    </text>
                  )}
                  <rect
                    x={x}
                    y={y}
                    width={SEAT_SIZE}
                    height={SEAT_SIZE}
                    rx={6}
                    fill={meta.fill}
                    stroke={isSelected ? '#111827' : meta.stroke}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="seatmap-seat"
                    onPointerDown={(e) => handleSeatPointerDown(e, seat)}
                    onPointerMove={handleSeatPointerMove}
                    onPointerUp={(e) => handleSeatPointerUp(e, seat)}
                  >
                    <title>
                      {`שורה ${seat.row}, מקום ${seat.col} — ${meta.label}${seat.name ? ` — ${seat.name}` : ''}`}
                    </title>
                  </rect>
                  <text
                    x={x + SEAT_SIZE / 2}
                    y={y + SEAT_SIZE / 2 + 4}
                    textAnchor="middle"
                    className="seatmap-seat-label"
                  >
                    {seat.col}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}
