// Define log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level: LogLevel;
  enableConsole: boolean;
  enableLocalStorage: boolean;
  maxLogsStored: number;
}

// Default options
const defaultOptions: LoggerOptions = {
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  enableConsole: process.env.NODE_ENV !== 'production',
  enableLocalStorage: true,
  maxLogsStored: 100,
};

// Log level priority
const logLevelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private options: LoggerOptions;
  
  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = { ...defaultOptions, ...options };
  }
  
  private shouldLog(level: LogLevel): boolean {
    return logLevelPriority[level] >= logLevelPriority[this.options.level];
  }
  
  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }
  
  private storeLog(formattedMessage: string): void {
    if (!this.options.enableLocalStorage) return;
    
    try {
      // Get existing logs
      const storedLogs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      
      // Add new log
      storedLogs.push(formattedMessage);
      
      // Trim if exceeds max logs
      if (storedLogs.length > this.options.maxLogsStored) {
        storedLogs.splice(0, storedLogs.length - this.options.maxLogsStored);
      }
      
      // Save back to localStorage
      localStorage.setItem('app_logs', JSON.stringify(storedLogs));
    } catch (error) {
      // Silently fail if localStorage is not available
    }
  }
  
  public debug(message: string, ...args: any[]): void {
    if (!this.shouldLog('debug')) return;
    
    const formattedMessage = this.formatMessage('debug', message, ...args);
    
    if (this.options.enableConsole) {
      console.debug(formattedMessage, ...args);
    }
    
    this.storeLog(formattedMessage);
  }
  
  public info(message: string, ...args: any[]): void {
    if (!this.shouldLog('info')) return;
    
    const formattedMessage = this.formatMessage('info', message, ...args);
    
    if (this.options.enableConsole) {
      console.info(formattedMessage, ...args);
    }
    
    this.storeLog(formattedMessage);
  }
  
  public warn(message: string, ...args: any[]): void {
    if (!this.shouldLog('warn')) return;
    
    const formattedMessage = this.formatMessage('warn', message, ...args);
    
    if (this.options.enableConsole) {
      console.warn(formattedMessage, ...args);
    }
    
    this.storeLog(formattedMessage);
  }
  
  public error(message: string, ...args: any[]): void {
    if (!this.shouldLog('error')) return;
    
    const formattedMessage = this.formatMessage('error', message, ...args);
    
    if (this.options.enableConsole) {
      console.error(formattedMessage, ...args);
    }
    
    this.storeLog(formattedMessage);
  }
  
  // Debugging utilities
  public group(label: string): void {
    if (this.options.enableConsole) {
      console.group(label);
    }
  }

  public groupEnd(): void {
    if (this.options.enableConsole) {
      console.groupEnd();
    }
  }

  public time(label: string): void {
    if (this.options.enableConsole) {
      console.time(label);
    }
  }

  public timeEnd(label: string): void {
    if (this.options.enableConsole) {
      console.timeEnd(label);
    }
  }

  public table(data: any): void {
    if (this.options.enableConsole) {
      console.table(data);
    }
  }

  public trace(message?: string): void {
    if (this.options.enableConsole) {
      if (message) {
        console.trace(message);
      } else {
        console.trace();
      }
    }
  }

  // Method to log objects with better formatting
  public logObject(label: string, obj: any): void {
    if (!this.shouldLog('debug')) return;
    
    if (this.options.enableConsole) {
      console.group(`🔍 ${label}`);
      console.log('Type:', typeof obj);
      console.log('Value:', obj);
      if (obj && typeof obj === 'object') {
        console.log('Keys:', Object.keys(obj));
        console.log('JSON:', JSON.stringify(obj, null, 2));
      }
      console.groupEnd();
    }
  }

  // Method to log function calls for debugging
  public logFunctionCall(functionName: string, args: any[] = [], result?: any): void {
    if (!this.shouldLog('debug')) return;
    
    if (this.options.enableConsole) {
      console.group(`🚀 Function Call: ${functionName}`);
      if (args.length > 0) {
        console.log('Arguments:', args);
      }
      if (result !== undefined) {
        console.log('Result:', result);
      }
      console.groupEnd();
    }
  }

  // Method to log React component renders
  public logRender(componentName: string, props?: any, state?: any): void {
    if (!this.shouldLog('debug')) return;
    
    if (this.options.enableConsole) {
      console.group(`🎨 Render: ${componentName}`);
      if (props) {
        console.log('Props:', props);
      }
      if (state) {
        console.log('State:', state);
      }
      console.groupEnd();
    }
  }

  // Method to log API calls
  public logApiCall(method: string, url: string, data?: any, response?: any): void {
    if (!this.shouldLog('debug')) return;
    
    if (this.options.enableConsole) {
      console.group(`🌐 API Call: ${method.toUpperCase()} ${url}`);
      if (data) {
        console.log('Request Data:', data);
      }
      if (response) {
        console.log('Response:', response);
      }
      console.groupEnd();
    }
  }
  
  // Utility method to export logs (for debugging or sending to server)
  public exportLogs(): string[] {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch (error) {
      return [];
    }
  }
  
  // Clear stored logs
  public clearLogs(): void {
    try {
      localStorage.removeItem('app_logs');
    } catch (error) {
      // Silently fail
    }
  }

  // Method to enable/disable console logging at runtime
  public setConsoleLogging(enabled: boolean): void {
    this.options.enableConsole = enabled;
  }

  // Method to change log level at runtime
  public setLogLevel(level: LogLevel): void {
    this.options.level = level;
  }
}

// Create and export a singleton instance
const logger = new Logger();

// Make logger available globally for debugging in browser console
if (typeof window !== 'undefined') {
  (window as any).debugLogger = logger;
}

export default logger; 