import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component without crashing', () => {
  // Mock localStorage for the logger
  const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  // Mock console methods to avoid noise in test output
  const consoleMock = {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
  Object.assign(console, consoleMock);

  const { container } = render(<App />);
  
  // Test that the component renders without throwing an error
  expect(container).toBeInTheDocument();
});
