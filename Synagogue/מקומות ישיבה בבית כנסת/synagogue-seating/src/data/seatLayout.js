// מבנה פיזי של בית הכנסת: אזורים (עזרת גברים / עזרת נשים) ובתוכם בלוקים (עמודות מקומות)
// כל בלוק מוגדר במספר שורות ומספר מקומות בכל שורה. שינוי המספרים כאן משנה את המפה כולה.

export const STATUS = {
  AVAILABLE: 'available',
  ASSIGNED: 'assigned',
  RESERVED: 'reserved',
};

export const STATUS_META = {
  [STATUS.AVAILABLE]: { label: 'פנוי', fill: '#d1fae5', stroke: '#10b981' },
  [STATUS.ASSIGNED]: { label: 'משוייך', fill: '#bfdbfe', stroke: '#3b82f6' },
  [STATUS.RESERVED]: { label: 'שמור', fill: '#fde68a', stroke: '#d97706' },
};

// 0 = טרם נקבע מחיר למקום. הערך הזה חייב להישאר תואם ל-DEFAULT בעמודת price ב-schema.sql
export const DEFAULT_PRICE = 0;

const SECTIONS_CONFIG = [
  {
    id: 'men',
    title: 'עזרת גברים',
    blocks: [
      { id: 'm-right', title: 'אגף ימין', rows: 6, seatsPerRow: 8 },
      { id: 'm-center', title: 'אגף מרכז', rows: 6, seatsPerRow: 10 },
      { id: 'm-left', title: 'אגף שמאל', rows: 6, seatsPerRow: 8 },
    ],
  },
  {
    id: 'women',
    title: 'עזרת נשים (יציע)',
    blocks: [
      { id: 'w-right', title: 'אגף ימין', rows: 5, seatsPerRow: 10 },
      { id: 'w-left', title: 'אגף שמאל', rows: 5, seatsPerRow: 10 },
    ],
  },
];

const SAMPLE_NAMES = [
  'כהן יעקב', 'לוי משה', 'מזרחי דוד', 'אברהם רחל', 'ביטון שרה',
  'פרץ אליהו', 'אזולאי חנה', 'גבאי שלמה', 'דהן מרים', 'עמר יוסף',
];

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 1000;
  }
  return h;
}

function buildBlockSeats(blockId, rows, seatsPerRow) {
  const seats = [];
  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= seatsPerRow; col++) {
      const id = `${blockId}-r${row}-s${col}`;
      const seed = hashSeed(id);
      let status = STATUS.AVAILABLE;
      let name = '';
      let price = DEFAULT_PRICE;
      // חלוקה לדוגמה בלבד - כדי שיהיה אפשר לראות מיד איך זה נראה עם נתונים אמיתיים
      if (seed % 7 === 0) {
        status = STATUS.ASSIGNED;
        name = SAMPLE_NAMES[seed % SAMPLE_NAMES.length];
        price = DEFAULT_PRICE;
      } else if (seed % 11 === 0) {
        status = STATUS.RESERVED;
        price = DEFAULT_PRICE;
      }
      seats.push({ id, blockId, row, col, status, name, price, posX: null, posY: null });
    }
  }
  return seats;
}

export function buildInitialLayout() {
  return SECTIONS_CONFIG.map((section) => ({
    ...section,
    blocks: section.blocks.map((block) => ({
      ...block,
      seats: buildBlockSeats(block.id, block.rows, block.seatsPerRow),
    })),
  }));
}
