import { useEffect, useRef, useState } from 'react';
import { STATUS, STATUS_META } from '../data/seatLayout';

const currencyFormatter = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
});

const FALLBACK_SAVE_ERROR = 'השמירה נכשלה, נסו שוב';

function errorMessage(err) {
  const message = err instanceof Error ? err.message : '';
  return message.trim() ? message : FALLBACK_SAVE_ERROR;
}

export default function SeatDetailsPanel({
  seat,
  blockTitle,
  editMode,
  onSave,
  onClose,
  onDelete,
  onResetPosition,
  deleting,
}) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState(STATUS.AVAILABLE);
  const [price, setPrice] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // מצביע תמיד על ה-seat העדכני ביותר, גם בתוך קולבקים אסינכרוניים שנפתחים
  // אחרי שהמשתמש כבר עבר למקום אחר. בלי תלויות - מתעדכן אחרי כל רינדור.
  const seatRef = useRef(null);
  useEffect(() => {
    seatRef.current = seat;
  });

  const syncFromSeat = (s) => {
    setName(s.name || '');
    setStatus(s.status);
    setPrice(s.price ?? 0);
  };

  useEffect(() => {
    if (seat) {
      syncFromSeat(seat);
      setSaving(false);
      setSaveError(null);
    }
    // מסתנכרנים רק כששדות התצוגה עצמם משתנים (או כשעוברים למקום אחר) -
    // לא על כל שינוי אובייקט (כמו גרירה שמעדכנת רק posX/posY), כדי שלא
    // "ישחרר" מנעול שמירה שעדיין רץ ולא ימחק טקסט שהמשתמש מקליד.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seat?.id, seat?.name, seat?.status, seat?.price]);

  if (!seat) {
    return (
      <aside className="seat-panel seat-panel-empty">
        <p>לחצו על מקום במפה כדי לצפות בפרטים או לעדכן אותם.</p>
      </aside>
    );
  }

  // שמירה פסימית: הטופס ננעל עד שהשרת מאשר. אם השמירה נכשלת חוזרים
  // לערכים האחרונים שהשרת אישר, כדי שהמסך לעולם לא יציג מידע שלא נשמר.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const target = seat; // המקום שאליו השמירה הזו שייכת
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(target.id, {
        name: name.trim(),
        status,
        price: Number(price) || 0,
      });
    } catch (err) {
      // אם המשתמש עבר בינתיים למקום אחר - לא נוגעים בטופס שלו
      if (seatRef.current?.id !== target.id) return;
      syncFromSeat(target);
      setSaveError(errorMessage(err));
    } finally {
      if (seatRef.current?.id === target.id) setSaving(false);
    }
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
            disabled={saving}
          />
        </label>

        <label className="field">
          <span>סטאטוס</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving}>
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
              disabled={saving}
            />
            <span className="price-currency">₪</span>
          </div>
          {/* dir="auto": המחרוזת המעוצבת של Intl.NumberFormat נושאת סימוני RLM משלה ולכן תמיד
              מוצגת נכון; ה-dir="auto" כאן קיים כדי שהודעת הטקסט בעברית (כש"טרם נקבע מחיר") תקבל כיווניות RTL */}
          <span className="field-hint" dir="auto">
            {Number(price) > 0 ? currencyFormatter.format(Number(price)) : 'טרם נקבע מחיר'}
          </span>
        </label>

        {saveError && (
          <p className="field-error" role="alert">
            {saveError}
          </p>
        )}

        <div className="seat-panel-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'שומר…' : 'שמירה'}
          </button>
        </div>
      </form>

      {editMode && (
        <div className="seat-panel-edit-actions">
          <hr />
          {seat.posX != null && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onResetPosition(seat.id)}
              disabled={saving}
            >
              איפוס מיקום לרשת המקורית
            </button>
          )}
          <button
            type="button"
            className="btn-danger"
            onClick={() => onDelete(seat.id)}
            disabled={saving || deleting}
          >
            {deleting ? 'מוחק…' : 'מחיקת מקום זה'}
          </button>
        </div>
      )}
    </aside>
  );
}
