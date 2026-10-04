import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { buildInitialLayout, STATUS_META } from './data/seatLayout';
import * as api from './api';
import SeatMap from './components/SeatMap';
import SeatDetailsPanel from './components/SeatDetailsPanel';

function computeStats(section) {
  const stats = { total: 0 };
  Object.keys(STATUS_META).forEach((key) => (stats[key] = 0));
  section.blocks.forEach((block) => {
    block.seats.forEach((seat) => {
      stats.total += 1;
      stats[seat.status] += 1;
    });
  });
  return stats;
}

function updateSeatInLayout(layout, seatId, updates) {
  return layout.map((section) => ({
    ...section,
    blocks: section.blocks.map((block) => ({
      ...block,
      seats: block.seats.map((seat) => (seat.id === seatId ? { ...seat, ...updates } : seat)),
    })),
  }));
}

export default function App() {
  const [layout, setLayout] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editBlockId, setEditBlockId] = useState(null);
  const [rowCount, setRowCount] = useState(8);

  const loadLayout = () => {
    setLoading(true);
    setLoadError(null);
    api
      .fetchLayout()
      .then((data) => {
        setLayout(data.sections);
        setOfflineMode(false);
        setActiveSectionId((prev) => prev ?? data.sections[0]?.id);
      })
      .catch((err) => {
        console.error(err);
        const fallback = buildInitialLayout();
        setLayout(fallback);
        setOfflineMode(true);
        setLoadError(err.message);
        setActiveSectionId((prev) => prev ?? fallback[0]?.id);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadLayout, []);

  const activeSection = layout?.find((s) => s.id === activeSectionId);

  useEffect(() => {
    if (!activeSection) return;
    if (!activeSection.blocks.some((b) => b.id === editBlockId)) {
      setEditBlockId(activeSection.blocks[0]?.id ?? null);
    }
  }, [activeSection, editBlockId]);

  const { selectedSeat, selectedBlockTitle } = useMemo(() => {
    if (!layout) return { selectedSeat: null, selectedBlockTitle: '' };
    for (const section of layout) {
      for (const block of section.blocks) {
        const seat = block.seats.find((s) => s.id === selectedSeatId);
        if (seat) return { selectedSeat: seat, selectedBlockTitle: `${section.title} · ${block.title}` };
      }
    }
    return { selectedSeat: null, selectedBlockTitle: '' };
  }, [layout, selectedSeatId]);

  const stats = useMemo(() => (activeSection ? computeStats(activeSection) : null), [activeSection]);

  const handleSeatClick = (seat) => setSelectedSeatId(seat.id);
  const handleClose = () => setSelectedSeatId(null);

  const handleSave = (seatId, updates) => {
    setLayout((prev) => updateSeatInLayout(prev, seatId, updates));
    if (!offlineMode) {
      api.updateSeat(seatId, updates).catch((err) => console.error('שמירה נכשלה:', err));
    }
  };

  const handleSeatMove = (seatId, posX, posY) => {
    setLayout((prev) => updateSeatInLayout(prev, seatId, { posX, posY }));
    if (!offlineMode) {
      api.updateSeat(seatId, { posX, posY }).catch((err) => console.error('שמירת מיקום נכשלה:', err));
    }
  };

  const handleResetPosition = (seatId) => {
    setLayout((prev) => updateSeatInLayout(prev, seatId, { posX: null, posY: null }));
    if (!offlineMode) {
      api.updateSeat(seatId, { posX: null, posY: null }).catch((err) => console.error(err));
    }
  };

  const handleAddSeat = (blockId, x, y) => {
    const block = activeSection?.blocks.find((b) => b.id === blockId);
    const nextCol = (block?.seats.length ?? 0) + 1;
    if (offlineMode) {
      const newSeat = {
        id: `${blockId}-custom-${Date.now()}`,
        blockId,
        row: 0,
        col: nextCol,
        status: 'available',
        name: '',
        price: 1200,
        posX: x,
        posY: y,
      };
      setLayout((prev) =>
        prev.map((section) => ({
          ...section,
          blocks: section.blocks.map((b) => (b.id === blockId ? { ...b, seats: [...b.seats, newSeat] } : b)),
        })),
      );
      return;
    }
    api
      .createSeat(blockId, { row: 0, col: nextCol, posX: x, posY: y })
      .then((newSeat) => {
        setLayout((prev) =>
          prev.map((section) => ({
            ...section,
            blocks: section.blocks.map((b) => (b.id === blockId ? { ...b, seats: [...b.seats, newSeat] } : b)),
          })),
        );
      })
      .catch((err) => console.error('הוספת מקום נכשלה:', err));
  };

  const handleDeleteSeat = (seatId) => {
    setLayout((prev) =>
      prev.map((section) => ({
        ...section,
        blocks: section.blocks.map((block) => ({
          ...block,
          seats: block.seats.filter((s) => s.id !== seatId),
        })),
      })),
    );
    setSelectedSeatId(null);
    if (!offlineMode) {
      api.deleteSeat(seatId).catch((err) => console.error('מחיקת מקום נכשלה:', err));
    }
  };

  const handleClearBlock = (blockId) => {
    if (!blockId) return;
    const block = activeSection?.blocks.find((b) => b.id === blockId);
    if (!block) return;
    const confirmed = window.confirm(
      `לנקות את כל ${block.seats.length} המקומות בבלוק "${block.title}"? הפעולה בלתי הפיכה.`,
    );
    if (!confirmed) return;

    setLayout((prev) =>
      prev.map((section) => ({
        ...section,
        blocks: section.blocks.map((b) => (b.id === blockId ? { ...b, seats: [] } : b)),
      })),
    );
    setSelectedSeatId(null);
    if (!offlineMode) {
      api.clearBlockSeats(blockId).catch((err) => console.error('ניקוי הבלוק נכשל:', err));
    }
  };

  const handleAddRow = (blockId, count) => {
    if (!blockId || !count || count < 1) return;
    const block = activeSection?.blocks.find((b) => b.id === blockId);
    if (!block) return;
    const gridRows = block.seats.filter((s) => s.posX == null).map((s) => s.row);
    const nextRow = gridRows.length ? Math.max(...gridRows) + 1 : 1;

    if (offlineMode) {
      const newSeats = Array.from({ length: count }, (_, i) => ({
        id: `${blockId}-r${nextRow}-s${i + 1}-${Date.now()}`,
        blockId,
        row: nextRow,
        col: i + 1,
        status: 'available',
        name: '',
        price: 1200,
        posX: null,
        posY: null,
      }));
      setLayout((prev) =>
        prev.map((section) => ({
          ...section,
          blocks: section.blocks.map((b) =>
            b.id === blockId ? { ...b, seats: [...b.seats, ...newSeats] } : b,
          ),
        })),
      );
      return;
    }

    api
      .addRow(blockId, nextRow, count)
      .then((newSeats) => {
        setLayout((prev) =>
          prev.map((section) => ({
            ...section,
            blocks: section.blocks.map((b) =>
              b.id === blockId ? { ...b, seats: [...b.seats, ...newSeats] } : b,
            ),
          })),
        );
      })
      .catch((err) => console.error('הוספת שורה נכשלה:', err));
  };

  if (loading) {
    return (
      <div className="app-loading">
        <p>טוען מפת מקומות…</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>מקומות ישיבה בבית הכנסת</h1>
        <div className="header-row">
          <nav className="section-tabs" role="tablist">
            {layout.map((section) => (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={section.id === activeSectionId}
                className={`section-tab ${section.id === activeSectionId ? 'active' : ''}`}
                onClick={() => {
                  setActiveSectionId(section.id);
                  setSelectedSeatId(null);
                }}
              >
                {section.title}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className={`edit-toggle ${editMode ? 'active' : ''}`}
            onClick={() => setEditMode((v) => !v)}
          >
            {editMode ? '✓ מצב עריכת מפה פעיל' : '✎ ערוך מפה (מיקום מקומות)'}
          </button>
        </div>
      </header>

      {offlineMode && (
        <div className="offline-banner">
          לא ניתן להתחבר לשרת ({loadError}) — עובד במצב הדגמה מקומי, שינויים לא יישמרו.
          <button type="button" onClick={loadLayout}>
            נסה שוב
          </button>
        </div>
      )}

      {editMode && (
        <div className="edit-banner">
          <p>במצב עריכה: גררו מקום קיים כדי להזיז אותו, או לחצו על שטח ריק בתוך בלוק כדי להוסיף מקום בודד.</p>

          <div className="edit-toolbar">
            <label className="edit-toolbar-field">
              <span>בלוק:</span>
              <select value={editBlockId ?? ''} onChange={(e) => setEditBlockId(e.target.value)}>
                {activeSection.blocks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </label>

            <label className="edit-toolbar-field">
              <span>מקומות בשורה:</span>
              <input
                type="number"
                dir="ltr"
                min={1}
                max={100}
                value={rowCount}
                onChange={(e) => setRowCount(Number(e.target.value))}
              />
            </label>

            <button
              type="button"
              className="btn-secondary edit-toolbar-btn"
              onClick={() => handleAddRow(editBlockId, rowCount)}
            >
              + הוסף שורה חדשה
            </button>

            <button
              type="button"
              className="btn-danger edit-toolbar-btn"
              onClick={() => handleClearBlock(editBlockId)}
            >
              נקה את כל המקומות בבלוק
            </button>
          </div>
        </div>
      )}

      <div className="app-body">
        <main className="app-main">
          <div className="legend">
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <span key={key} className="legend-item">
                <span className="legend-swatch" style={{ background: meta.fill, borderColor: meta.stroke }} />
                {meta.label}
              </span>
            ))}
          </div>

          <div className="stats-bar">
            <span>סה״כ מקומות: {stats.total}</span>
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <span key={key}>
                {meta.label}: {stats[key]}
              </span>
            ))}
          </div>

          <div className="seatmap-wrap">
            <SeatMap
              blocks={activeSection.blocks}
              selectedSeatId={selectedSeatId}
              editMode={editMode}
              onSeatClick={handleSeatClick}
              onSeatMove={handleSeatMove}
              onAddSeat={handleAddSeat}
            />
          </div>
        </main>

        <SeatDetailsPanel
          seat={selectedSeat}
          blockTitle={selectedBlockTitle}
          editMode={editMode}
          onSave={handleSave}
          onClose={handleClose}
          onDelete={handleDeleteSeat}
          onResetPosition={handleResetPosition}
        />
      </div>
    </div>
  );
}
