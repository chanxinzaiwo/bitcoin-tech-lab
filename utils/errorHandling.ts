/**
 * Error handling utilities for consistent error management across the app
 */

// Custom error types
export class SimulationError extends Error {
  constructor(message: string, public readonly component: string) {
    super(message);
    this.name = 'SimulationError';
  }
}

export class CryptoError extends Error {
  constructor(message: string, public readonly operation: string) {
    super(message);
    this.name = 'CryptoError';
  }
}

export class StorageError extends Error {
  constructor(message: string, public readonly key: string) {
    super(message);
    this.name = 'StorageError';
  }
}

// Error logging utility
export interface ErrorLogEntry {
  timestamp: number;
  type: string;
  message: string;
  component?: string;
  stack?: string;
}

const errorLog: ErrorLogEntry[] = [];
const MAX_LOG_SIZE = 100;

export function logError(error: Error, component?: string): void {
  const entry: ErrorLogEntry = {
    timestamp: Date.now(),
    type: error.name,
    message: error.message,
    component,
    stack: error.stack,
  };

  errorLog.push(entry);

  // Keep log size manageable
  if (errorLog.length > MAX_LOG_SIZE) {
    errorLog.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${component || 'App'}]`, error);
  }
}

export function getErrorLog(): ErrorLogEntry[] {
  return [...errorLog];
}

export function clearErrorLog(): void {
  errorLog.length = 0;
}

// Safe execution wrapper
export function tryCatch<T>(
  fn: () => T,
  fallback: T,
  component?: string,
): T {
  try {
    return fn();
  } catch (error) {
    logError(error as Error, component);
    return fallback;
  }
}

// Async safe execution wrapper
export async function tryCatchAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  component?: string,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logError(error as Error, component);
    return fallback;
  }
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Safe JSON stringify
export function safeJsonStringify(value: unknown, fallback: string = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

// Safe localStorage operations
export function safeLocalStorageGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageSet(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    logError(new StorageError('Failed to save to localStorage', key));
    return false;
  }
}

export function safeLocalStorageRemove(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

// Result type for operations that can fail
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Retry utility for unreliable operations
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
}

// Validation utilities
export function assertDefined<T>(
  value: T | null | undefined,
  message: string = 'Value is undefined',
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message);
  }
}

export function assertNumber(
  value: unknown,
  message: string = 'Value is not a number',
): asserts value is number {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(message);
  }
}

export function assertString(
  value: unknown,
  message: string = 'Value is not a string',
): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(message);
  }
}

// Safe number operations
export function safeParseInt(value: string, fallback: number = 0): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

export function safeParseFloat(value: string, fallback: number = 0): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Type guard utilities
export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}
