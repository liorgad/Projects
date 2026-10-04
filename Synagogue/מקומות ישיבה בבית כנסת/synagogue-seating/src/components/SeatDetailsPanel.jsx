import { useEffect, useState } from 'react';
import { STATUS, STATUS_META } from '../data/seatLayout';

const currencyFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
});

export default function SeatDetailsPanel({ seat, blockTitle, editMode, onSave, onClose, onDelete, onResetPosition }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState(STATUS.AVAILABLE);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (seat) {
      setName(seat.name || '');
      setStatus(seat.status);
      setPrice(seat.price || 0);
    }
  }, [seat]);

  if (!seat) {
    return (
      <aside className="seat-panel seat-panel-empty">
        <p>לחצו על מקום במפה כדי לצפות בפרטים או לעדכן אותם.</p>
      </aside>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(seat.id, {
      name: status === STATUS.ASSIGNED ? name.trim() : name.trim(),
      status,
      price: Number(price) || 0,
    });
  };

  return (
    <aside className="seat-panel">
      <div className="seat-panel-header">
        <h2>
          {blockTitle} · שורה {seat.row} · מקום {seat.col}
        </h2>
        <button type="button" className="seat-panel-close" onClick={onClose} aria-label="סגירה">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="seat-panel-form">
        <label className="field">
          <span>שם</span>
          <input
            type="text"
            dir="auto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="שם המחזיק במקום"
          />
        </label>

        <label className="field">
          <span>סטאטוס</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {Object.entries(STATUS_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>מחיר שנתי</span>
          <div className="price-input-wrap">
            <input
              type="number"
              dir="ltr"
              min={0}
              step={50}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <span className="price-currency">₪</span>
          </div>
          <span className="field-hint" dir="ltr">
            {currencyFormatter.format(Number(price) || 0)}
          </span>
        </label>

        <div className="seat-panel-actions">
          <button type="submit" className="btn-primary">
            שמירה
          </button>
        </div>
      </form>

      {editMode && (
        <div className="seat-panel-edit-actions">
          <hr />
          {seat.posX != null && (
            <button type="button" className="btn-secondary" onClick={() => onResetPosition(seat.id)}>
              איפוס מיקום לרשת המקורית
            </button>
          )}
          <button type="button" className="btn-danger" onClick={() => onDelete(seat.id)}>
            מחיקת מקום זה
          </button>
        </div>
      )}
    </aside>
  );
}
