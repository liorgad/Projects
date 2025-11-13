# Debugging Guide

This guide explains how to debug the Shift Manager application using VS Code breakpoints and various debugging tools.

## Prerequisites

- Visual Studio Code installed
- Chrome browser (for frontend debugging)
- Project dependencies installed (`npm install` in both frontend and backend folders)

## Available Debug Configurations

### 1. Debug React App (Chrome)
- **Best for**: Frontend debugging with breakpoints in React components
- **How to use**: 
  1. Start the React dev server first: `cd frontend && npm start`
  2. Go to Run and Debug panel (Ctrl+Shift+D)
  3. Select "Debug React App (Chrome)" from dropdown
  4. Click the green play button
  5. Chrome will open automatically and connect to the debugger

### 2. Debug React App (Node)
- **Best for**: Server-side rendering debugging or when you want to debug the build process
- **How to use**:
  1. Go to Run and Debug panel (Ctrl+Shift+D)
  2. Select "Debug React App" from dropdown
  3. Click the green play button
  4. This will start the React dev server with debugging enabled

### 3. Debug Backend
- **Best for**: API debugging, database operations, middleware debugging
- **How to use**:
  1. Make sure your `.env` file is configured in the backend folder
  2. Go to Run and Debug panel (Ctrl+Shift+D)
  3. Select "Debug Backend" from dropdown
  4. Click the green play button

### 4. Debug Backend (Nodemon)
- **Best for**: Backend debugging with automatic restart on file changes
- **How to use**:
  1. Go to Run and Debug panel (Ctrl+Shift+D)
  2. Select "Debug Backend (Nodemon)" from dropdown
  3. Click the green play button
  4. The server will restart automatically when you save files

### 5. Debug Full Stack
- **Best for**: Debugging both frontend and backend simultaneously
- **How to use**:
  1. Go to Run and Debug panel (Ctrl+Shift+D)
  2. Select "Debug Full Stack" from dropdown
  3. Click the green play button
  4. Both Chrome and the backend debugger will start

## Setting Breakpoints

### Frontend (React) Breakpoints
1. Open any `.tsx` or `.ts` file in the `frontend/src` folder
2. Click on the line number where you want to set a breakpoint (red dot will appear)
3. Start the "Debug React App (Chrome)" configuration
4. Interact with your app in the browser to trigger the breakpoint
5. VS Code will pause execution and show variable values

### Backend (Node.js) Breakpoints
1. Open any `.ts` file in the `backend/src` folder
2. Click on the line number where you want to set a breakpoint
3. Start the "Debug Backend" or "Debug Backend (Nodemon)" configuration
4. Make HTTP requests to your API endpoints to trigger breakpoints
5. VS Code will pause execution and show variable values

## Debugging Features

### Variable Inspection
- **Variables Panel**: Shows local variables, closure variables, and global variables
- **Watch Panel**: Add custom expressions to watch their values
- **Hover**: Hover over variables in code to see their current values

### Call Stack
- View the function call hierarchy
- Click on any frame to see the code and variables at that point

### Debug Console
- Execute JavaScript/TypeScript expressions in the current debugging context
- Useful for testing quick fixes or exploring object properties

### Conditional Breakpoints
1. Right-click on a breakpoint (red dot)
2. Select "Edit Breakpoint"
3. Add a condition (e.g., `userId === '123'`)
4. Breakpoint will only trigger when condition is true

### Logpoints
1. Right-click on a line number
2. Select "Add Logpoint"
3. Enter a message to log (e.g., `User ID: {userId}`)
4. This logs values without stopping execution

## Quick Tasks

Use the Command Palette (Ctrl+Shift+P) and search for:
- `Tasks: Run Task` then select:
  - "Start Frontend" - Start React dev server
  - "Start Backend" - Start backend dev server
  - "Start Full Stack" - Start both frontend and backend
  - "Build Frontend" - Build production frontend
  - "Test Frontend" - Run frontend tests

## Debugging Tips

### Frontend Debugging
- Use React Developer Tools browser extension alongside VS Code debugging
- Set breakpoints in `useEffect` hooks to debug component lifecycle
- Debug custom hooks by setting breakpoints inside them
- Use the Network tab in Chrome DevTools to debug API calls

### Backend Debugging
- Set breakpoints in route handlers to debug API endpoints
- Debug middleware by setting breakpoints in the middleware functions
- Use the logger to trace execution flow: `logger.debug('Debug message', { data })`
- Debug database operations by setting breakpoints before and after database calls

### Common Issues
1. **Breakpoints not hitting in frontend**: Make sure source maps are enabled and the Chrome debugger is attached
2. **Backend breakpoints not working**: Ensure the backend is started with the debug configuration, not just `npm run dev`
3. **Chrome not opening**: Check if port 3000 is already in use or if Chrome is set as default browser

## Environment Variables

Make sure you have the following environment files configured:
- `frontend/.env.local` (optional) - Frontend environment variables
- `backend/.env` - Backend environment variables (required for Supabase)

## Browser DevTools

In addition to VS Code debugging, you can use Chrome DevTools:
1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Navigate to your source files under webpack://
4. Set breakpoints directly in the browser
5. Use Console tab for logging and expression evaluation

This setup provides a comprehensive debugging environment for both frontend and backend development! 