import { useEffect, useRef } from 'react';
import logger from '../utils/logger';

// Hook to log component lifecycle events
export function useLogger(componentName: string) {
  const mountedRef = useRef(false);
  
  useEffect(() => {
    // Only log on first mount
    if (!mountedRef.current) {
      logger.debug(`Component mounted: ${componentName}`);
      mountedRef.current = true;
    }
    
    return () => {
      logger.debug(`Component unmounted: ${componentName}`);
    };
  }, [componentName]);
  
  // Return logger instance for component-specific logging with debugging utilities
  return {
    debug: (message: string, ...args: any[]) => 
      logger.debug(`[${componentName}] ${message}`, ...args),
    info: (message: string, ...args: any[]) => 
      logger.info(`[${componentName}] ${message}`, ...args),
    warn: (message: string, ...args: any[]) => 
      logger.warn(`[${componentName}] ${message}`, ...args),
    error: (message: string, ...args: any[]) => 
      logger.error(`[${componentName}] ${message}`, ...args),
    
    // Debugging utilities
    logRender: (props?: any, state?: any) => 
      logger.logRender(componentName, props, state),
    logObject: (label: string, obj: any) => 
      logger.logObject(`[${componentName}] ${label}`, obj),
    logFunctionCall: (functionName: string, args: any[] = [], result?: any) => 
      logger.logFunctionCall(`[${componentName}] ${functionName}`, args, result),
    logApiCall: (method: string, url: string, data?: any, response?: any) => 
      logger.logApiCall(method, url, data, response),
    
    // Console utilities
    group: (label: string) => logger.group(`[${componentName}] ${label}`),
    groupEnd: () => logger.groupEnd(),
    time: (label: string) => logger.time(`[${componentName}] ${label}`),
    timeEnd: (label: string) => logger.timeEnd(`[${componentName}] ${label}`),
    table: (data: any) => logger.table(data),
    trace: (message?: string) => logger.trace(message ? `[${componentName}] ${message}` : undefined),
  };
}

export default useLogger; 