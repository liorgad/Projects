import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// ניקוי ה-DOM בין בדיקות כדי שרכיבים לא ידלפו מבדיקה אחת לשנייה
afterEach(() => {
  cleanup();
});
