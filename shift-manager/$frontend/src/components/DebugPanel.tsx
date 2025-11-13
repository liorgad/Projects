import React, { useState, useEffect } from 'react';
import useLogger from '../hooks/useLogger';
import logger from '../utils/logger';

interface DebugPanelProps {
  isVisible?: boolean;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ isVisible = false }) => {
  const componentLogger = useLogger('DebugPanel');
  const [counter, setCounter] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [testData, setTestData] = useState({ name: 'Test', value: 42 });

  useEffect(() => {
    componentLogger.debug('DebugPanel effect triggered', { counter, testData });
    // This is a good place to set a breakpoint to debug useEffect
  }, [counter, testData, componentLogger]);

  const handleCounterIncrement = () => {
    componentLogger.time('Counter Increment');
    
    // Set a breakpoint here to debug state updates
    const newValue = counter + 1;
    componentLogger.logFunctionCall('setCounter', [newValue]);
    setCounter(newValue);
    
    componentLogger.timeEnd('Counter Increment');
  };

  const handleTestApiCall = async () => {
    componentLogger.group('Test API Call');
    
    try {
      // Simulate an API call - good place for breakpoints
      const requestData = { test: true, timestamp: Date.now() };
      componentLogger.logApiCall('GET', '/api/test', requestData);
      
      // Set a breakpoint here to debug async operations
      const response = await new Promise(resolve => 
        setTimeout(() => resolve({ success: true, data: 'test response' }), 1000)
      );
      
      componentLogger.logApiCall('GET', '/api/test', requestData, response);
      componentLogger.info('API call completed successfully');
    } catch (error) {
      componentLogger.error('API call failed', error);
    } finally {
      componentLogger.groupEnd();
    }
  };

  const handleLogObject = () => {
    // Good place to set breakpoints to inspect objects
    const complexObject = {
      user: { id: 1, name: 'John Doe' },
      settings: { theme: 'dark', notifications: true },
      metadata: { created: new Date(), version: '1.0.0' }
    };
    
    componentLogger.logObject('Complex Object', complexObject);
    componentLogger.table(complexObject);
  };

  const handleExportLogs = () => {
    const exportedLogs = logger.exportLogs();
    setLogs(exportedLogs);
    componentLogger.info(`Exported ${exportedLogs.length} logs`);
  };

  const handleClearLogs = () => {
    logger.clearLogs();
    setLogs([]);
    componentLogger.info('Logs cleared');
  };

  const handleTestError = () => {
    try {
      // Intentional error for debugging
      throw new Error('This is a test error for debugging');
    } catch (error) {
      componentLogger.error('Caught test error', error);
      componentLogger.trace('Error stack trace');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="text-lg font-bold mb-4">🐛 Debug Panel</h3>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span>Counter: {counter}</span>
          <button 
            onClick={handleCounterIncrement}
            className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-sm"
          >
            Increment
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleTestApiCall}
            className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-sm"
          >
            Test API Call
          </button>
          
          <button 
            onClick={handleLogObject}
            className="bg-purple-500 hover:bg-purple-600 px-2 py-1 rounded text-sm"
          >
            Log Object
          </button>
          
          <button 
            onClick={handleTestError}
            className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded text-sm"
          >
            Test Error
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={handleExportLogs}
            className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-sm"
          >
            Export Logs
          </button>
          
          <button 
            onClick={handleClearLogs}
            className="bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded text-sm"
          >
            Clear Logs
          </button>
        </div>

        {logs.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Recent Logs ({logs.length}):</h4>
            <div className="bg-gray-900 p-2 rounded text-xs max-h-32 overflow-y-auto">
              {logs.slice(-5).map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        💡 Set breakpoints in this component to practice debugging!
        <br />
        🌐 Open browser console to see logger output
        <br />
        🔍 Use `debugLogger` in console for manual logging
      </div>
    </div>
  );
};

export default DebugPanel; 