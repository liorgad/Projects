# AGENTS.md

הנחיות לסוכני קוד (Claude, Codex, Cursor וכו') שעובדים על הפרויקט. פירוט מלא יותר ב-`CLAUDE.md`.

## כללים
- אל תמחק קבצים בלי אישור מפורש מהמשתמש.
- אל תיגע ב-`node_modules` או `pnpm-lock.yaml` שב-`synagogue-seating/` (לא נוצרו על ידי סוכן).
- UI בעברית ו-RTL: logical properties בלבד, `dir="auto"` לשדות טקסט, `dir="ltr"` למספרים.
- שמור על סגנון הקיים: Frontend ב-JSX (ללא TypeScript), Backend ב-TypeScript ESM (ייבוא עם סיומת `.js`).

## ממה זה מורכב
- Frontend: React 19 + Vite ב-`synagogue-seating/src`. מפה ב-SVG ידני (`components/SeatMap.jsx`), לא ספריית מפות.
- Backend: Express + `pg` ב-`synagogue-seating/backend/src`, SQL ישיר, בלי ORM.
- DB: PostgreSQL 16. סכימה ב-`backend/src/schema.sql` (`sections`, `blocks`, `seats`).
- פריסה: `docker-compose.yml` עם `db`, `backend`, `frontend` (nginx).

## פקודות
```bash
# Frontend (בתוך synagogue-seating)
npm install && npm run dev        # פיתוח
npm run build && npx oxlint src   # אימות

# Backend (בתוך synagogue-seating/backend)
npm install && npx tsc --noEmit   # בדיקת טיפוסים
npm run build                     # tsc + העתקת schema.sql ל-dist
npm run dev                       # tsx watch
npm run db:init / db:seed         # סכימה / נתוני דמו

# הכל
docker compose up --build         # frontend :8080, API :4000, db :5432
```

## נקודות שחשוב לדעת לפני שמשנים קוד
- `VITE_API_URL` נאפה ל-bundle בזמן build; שינוי בזמן ריצה לא ישפיע. ב-Docker הוא מועבר כ-build arg.
- אם `posX/posY` הם null, מיקום המקום נגזר מ-row/col; אחרת הוא מיקום חופשי בקואורדינטות של הבלוק. אל תשבור את ההתאמה הזו בין `seatPosition` (frontend) למה ששרת שומר.
- מקום חופשי נוצר עם `row: 0`. "הוסף שורה" מחשב את השורה הבאה רק ממקומות ברשת (`posX == null`).
- השרת מריץ `applySchema` ו-`seedIfEmpty` בעלייה (כבוי עם `AUTO_MIGRATE=false`). הסכימה אידמפוטנטית (`IF NOT EXISTS`) — שינוי עמודות דורש מיגרציה ידנית, כי אין כלי מיגרציות.
- Frontend נופל ל-`offlineMode` עם נתוני הדגמה כשאין API; בדוק שכל handler חדש מכבד את `offlineMode`.
- ה-API מחזיר camelCase (`blockId`, `posX`); ה-DB שומר snake_case. ההמרה ב-`mapSeat` ב-`backend/src/types.ts`.
- נקודות קצה לבלוקים (`PATCH/POST/DELETE`) קיימות בשרת אך לא מחוברות ל-UI.

## מה נבדק
אומת ב-2026-10-04: `docker compose up --build`, PostgreSQL אמיתי (256 מקומות דרך `/api/layout`),
והתנהגות בדפדפן (טעינת המפה, בחירת מקום, 0 שגיאות קונסול).
לא נבדק: מסלול ההזרעה על DB ריק — דורש מחיקת ה-volume.

## בדיקות
`pnpm test` ב-frontend, `npm test` ב-`backend/`. ה-frontend ב-pnpm וה-backend ב-npm — אל תחליף.

## היסטוריה בקצרה
ספריית `@alisaitteke/seatmap-canvas` נפסלה (חבילת ה-React שלה שבורה ב-npm), נבנה רכיב SVG עצמאי → נוסף backend ב-TS+Postgres → מצב עריכה (גרירה/הוספה/מחיקה) → "נקה בלוק" ו"הוסף שורה" → Docker → בדיקות Vitest + תיקון מחיר ברירת מחדל, שמירה פסימית, ו-camelCase ב-blocks.
