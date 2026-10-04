# CLAUDE.md — מקומות ישיבה בבית הכנסת

## כללים קבועים
- **לעולם לא למחוק קובץ בלי אישור מפורש מהמשתמש.**
- ממשק המשתמש בעברית ו-RTL. להשתמש ב-CSS logical properties (`margin-inline-start`, `inset-inline-start` וכו') ולא ב-left/right. שדות טקסט עם `dir="auto"`, מספרים/מחירים עם `dir="ltr"`.
- בתיקיית העבודה (workspace) יש קבצים שלא נוצרו על ידי Claude (`node_modules`, `pnpm-lock.yaml` ב-`synagogue-seating/`) — לא לגעת, לא למחוק.

## מה הפרויקט
אפליקציה לניהול מפת מקומות ישיבה בבית כנסת: הצגת המקומות (עזרת גברים / עזרת נשים-יציע), סטאטוס, שם בעל המקום ומחיר שנתי, ושרטוט חופשי של האולם במצב עריכה. הנתונים נשמרים ב-PostgreSQL דרך שירות Backend ב-TypeScript. בסוף הכל רץ ב-Docker.

כל הקוד נמצא ב-`synagogue-seating/`.

## מבנה
```
synagogue-seating/
  src/                      Frontend (React 19 + Vite, JS/JSX)
    App.jsx                 מצב ראשי: טעינת layout מה-API, מצב עריכה, כל ה-handlers
    api.js                  לקוח fetch ל-backend (VITE_API_URL)
    components/SeatMap.jsx  ציור SVG של המפה, גרירת מקומות, הוספה בלחיצה על שטח ריק
    components/SeatDetailsPanel.jsx  פאנל צד: שם/סטאטוס/מחיר, מחיקה, איפוס מיקום
    data/seatLayout.js      STATUS, STATUS_META + נתוני הדגמה (fallback כשאין שרת)
  backend/                  Express + TypeScript + pg (ESM, NodeNext)
    src/server.ts           נקודת כניסה; ב-AUTO_MIGRATE (ברירת מחדל פעיל) מריץ waitForDb→applySchema→seedIfEmpty
    src/bootstrap.ts        waitForDb, applySchema, seedDemoData, seedIfEmpty
    src/schema.sql          sections / blocks / seats
    src/routes/             layout.ts, seats.ts, blocks.ts
    src/types.ts            טיפוסים + mapSeat (snake_case → camelCase)
    src/init-db.ts, seed.ts סקריפטי CLI (npm run db:init / db:seed)
    Dockerfile
  Dockerfile                Frontend: build עם Vite ואז nginx
  nginx.conf
  docker-compose.yml        db (postgres:16-alpine) + backend + frontend
  README.md                 הוראות הרצה
```

## מודל נתונים
- `sections` (id, title, sort_order) → `blocks` (id, section_id, title, sort_order) → `seats`.
- `seats`: id, block_id, row_num, col_num, pos_x, pos_y (nullable), name, status (`available|assigned|reserved`), price.
- **מיקום מקום**: אם `posX/posY` הם null — מחושב מהרשת לפי row/col (`seatPosition` ב-SeatMap.jsx). אם מוגדרים — מיקום חופשי בקואורדינטות מקומיות של הבלוק.
- מקום שנוסף בלחיצה חופשית נשמר עם `row: 0`, `col` רץ, ו-posX/posY. שורה שנוספה בכפתור "הוסף שורה" נשמרת עם row/col ו-pos null (מיקום ברשת).
- גבולות הבלוק ב-SVG מחושבים דינמית מהמקומות בפועל (אין rows/seatsPerRow בבלוק).

## API (prefix `/api`)
- `GET /health`, `GET /layout` (sections→blocks→seats מקונן)
- `PATCH /seats/:id` (name/status/price/posX/posY; `null` מאפס מיקום), `DELETE /seats/:id`
- `POST /blocks/:blockId/seats` (מקום בודד: row, col, posX?, posY?)
- `POST /blocks/:blockId/seats/row` ({row, count}) — שורה שלמה בטרנזקציה
- `DELETE /blocks/:blockId/seats` — ניקוי כל המקומות בבלוק
- `PATCH /blocks/:id`, `POST /sections/:sectionId/blocks`, `DELETE /blocks/:id` (קיימים ב-backend, עדיין לא מחוברים ל-UI)

## מצב עריכה (Frontend)
כפתור "ערוך מפה": גרירת מקום (pointer events, שמירה ב-PATCH בשחרור), לחיצה על שטח ריק בבלוק מוסיפה מקום, פאנל הפרטים מציע מחיקה ואיפוס מיקום, וסרגל כלים: בחירת בלוק + "מקומות בשורה" + "הוסף שורה חדשה" + "נקה את כל המקומות בבלוק" (עם confirm). תהליך מומלץ לשרטוט מחדש: נקה בלוק → הוסף שורות → גרור לדיוק.
אם ה-API לא זמין, ה-App עובר ל-offlineMode עם נתוני הדגמה (באנר אדום, שינויים לא נשמרים).

## הרצה
- Docker: `docker compose up --build` → frontend http://localhost:8080, API http://localhost:4000/api. הסכימה והזרעת נתוני דמו (רק אם ה-DB ריק) קורים אוטומטית.
- מקומי Frontend: `cp .env.example .env && npm install && npm run dev`.
- מקומי Backend: `cd backend && cp .env.example .env && npm install && npm run build && npm run db:init && npm run dev`.
- `VITE_API_URL` נאפה לתוך ה-bundle בזמן build (ARG ב-Dockerfile / `args` ב-compose). הדפדפן הוא זה שקורא ל-`localhost:4000`. לפריסה לשרת אמיתי צריך לבנות מחדש עם כתובת ה-API הציבורית.

## החלטות והיסטוריה
1. נבדקה ספריית `@alisaitteke/seatmap-canvas`. נפסלה: ה-subpath `/react` מצביע על `src/` שלא נכלל בחבילת ה-npm (נשבר), וה-API הווניל לא אומת. במקומה נבנה רכיב SVG עצמאי. אין תלות בה (הוסרה מ-package.json).
2. נבנה Backend ב-TypeScript עם `pg` ו-SQL ישיר (בלי ORM, כדי להימנע מ-binaries והגירות).
3. נוסף מצב עריכה, ואז כלי "נקה בלוק" ו"הוסף שורה".
4. נוסף Docker (3 שירותים) ו-README.

## מה אומת ומה לא
- אומת: `tsc --noEmit` ו-build של ה-backend; `vite build` ו-oxlint של ה-frontend (0 אזהרות); השרת עולה ועונה ל-`/api/health`, ושגיאת DB מטופלת ב-500 בעברית בלי קריסה.
- **לא נבדק מול Postgres אמיתי** (בסביבת הפיתוח של Claude אין הרשאות root להתקנה).
- **לא נבדק `docker compose up --build`** (אין Docker בסביבת הפיתוח של Claude). לבדוק ידנית.
- לא נבדק בדפדפן בפועל: גרירה, הוספה בלחיצה, סרגל הכלים.

## רעיונות להמשך
חיבור ה-UI לעריכת בלוקים (שינוי שם, יצירה, מחיקה), הרשאות/התחברות, ייצוא לאקסל/PDF, undo, בחירה מרובה וגרירה קבוצתית, משתני סביבה ל-`VITE_API_URL` דרך `.env` של compose.
