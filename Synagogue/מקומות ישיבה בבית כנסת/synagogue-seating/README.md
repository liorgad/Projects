# מקומות ישיבה בבית הכנסת

אפליקציית ניהול מפת מקומות ישיבה: פרונט React (Vite) + Backend ב-TypeScript + PostgreSQL.

## מבנה הפרויקט

- `src/` — הפרונט (React). מפת המקומות מצוירת ב-SVG, כולל מצב עריכה לגרירת/הוספת/מחיקת מקומות.
- `backend/` — שרת API ב-TypeScript (Express) שמדבר עם PostgreSQL.
- `docker-compose.yml` — מריץ את כל המערכת (DB + backend + frontend) בפקודה אחת.

## הרצה עם Docker (הכי פשוט)

דרישה: Docker + Docker Compose מותקנים.

```bash
docker compose up --build
```

- הפרונט יעלה בכתובת http://localhost:8080
- ה-API יעלה בכתובת http://localhost:4000/api
- מסד הנתונים (PostgreSQL) יוקם אוטומטית, כולל טבלאות ונתוני דמו ראשוניים (בפעם הראשונה בלבד).

לעצירה: `docker compose down` (הנתונים נשמרים ב-volume). למחיקת הנתונים לגמרי: `docker compose down -v`.

## הרצה מקומית (ללא Docker)

### Backend

```bash
cd backend
cp .env.example .env   # ולערוך את DATABASE_URL לפי מסד ה-PostgreSQL המקומי שלכם
npm install
npm run build
npm run db:init   # יוצר את הטבלאות
npm run db:seed   # ממלא נתוני דמו (אופציונלי)
npm run dev        # שרת פיתוח על פורט 4000
```

### Frontend

```bash
cp .env.example .env   # ברירת מחדל מצביעה ל-http://localhost:4000/api
npm install
npm run dev
```

אם השרת (backend) לא זמין, האפליקציה עוברת אוטומטית ל"מצב הדגמה מקומי" עם נתוני דוגמה — כדי שאפשר להמשיך לעבוד על העיצוב גם בלי חיבור ל-DB, אבל אז שינויים לא נשמרים.

## מצב עריכת מפה

לחיצה על "ערוך מפה" בראש העמוד מפעילה מצב עריכה:
- **גרירת מקום קיים** — משנה את מיקומו החופשי במפה (נשמר במסד הנתונים).
- **לחיצה על שטח ריק בתוך בלוק** — מוסיפה מקום חדש באותה נקודה.
- **מחיקת מקום / איפוס מיקום לרשת** — זמינים בפאנל הפרטים של מקום נבחר.

כך אפשר לשרטט את מבנה האולם בצורה מדויקת יותר, שורה-שורה או מקום-מקום.
