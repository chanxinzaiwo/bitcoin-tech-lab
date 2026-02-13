import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  SimulationError,
  CryptoError,
  StorageError,
  logError,
  getErrorLog,
  clearErrorLog,
  tryCatch,
  tryCatchAsync,
  safeJsonParse,
  safeJsonStringify,
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
  ok,
  err,
  safeParseInt,
  safeParseFloat,
  clamp,
  isError,
  isString,
  isNumber,
  isObject,
  isArray,
  assertDefined,
  assertNumber,
  assertString,
} from '../../utils/errorHandling';

describe('errorHandling utilities', () => {
  beforeEach(() => {
    clearErrorLog();
    localStorage.clear();
  });

  describe('Custom Error Classes', () => {
    it('should create SimulationError with component info', () => {
      const error = new SimulationError('Test error', 'TestComponent');
      expect(error.name).toBe('SimulationError');
      expect(error.message).toBe('Test error');
      expect(error.component).toBe('TestComponent');
    });

    it('should create CryptoError with operation info', () => {
      const error = new CryptoError('Crypto error', 'hash');
      expect(error.name).toBe('CryptoError');
      expect(error.operation).toBe('hash');
    });

    it('should create StorageError with key info', () => {
      const error = new StorageError('Storage error', 'testKey');
      expect(error.name).toBe('StorageError');
      expect(error.key).toBe('testKey');
    });
  });

  describe('Error Logging', () => {
    it('should log errors', () => {
      const error = new Error('Test error');
      logError(error, 'TestComponent');
      const log = getErrorLog();
      expect(log.length).toBe(1);
      expect(log[0].message).toBe('Test error');
      expect(log[0].component).toBe('TestComponent');
    });

    it('should clear error log', () => {
      logError(new Error('Test'));
      clearErrorLog();
      expect(getErrorLog().length).toBe(0);
    });
  });

  describe('tryCatch', () => {
    it('should return function result on success', () => {
      const result = tryCatch(() => 42, 0);
      expect(result).toBe(42);
    });

    it('should return fallback on error', () => {
      const result = tryCatch(() => {
        throw new Error('Test');
      }, 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('tryCatchAsync', () => {
    it('should return promise result on success', async () => {
      const result = await tryCatchAsync(async () => 42, 0);
      expect(result).toBe(42);
    });

    it('should return fallback on error', async () => {
      const result = await tryCatchAsync(async () => {
        throw new Error('Test');
      }, 'fallback');
      expect(result).toBe('fallback');
    });
  });

  describe('JSON utilities', () => {
    it('should parse valid JSON', () => {
      const result = safeJsonParse('{"key": "value"}', {});
      expect(result).toEqual({ key: 'value' });
    });

    it('should return fallback for invalid JSON', () => {
      const result = safeJsonParse('invalid', { default: true });
      expect(result).toEqual({ default: true });
    });

    it('should stringify objects', () => {
      const result = safeJsonStringify({ key: 'value' });
      expect(result).toBe('{"key":"value"}');
    });

    it('should return fallback for circular references', () => {
      const obj: Record<string, unknown> = {};
      obj.self = obj;
      const result = safeJsonStringify(obj, '{}');
      expect(result).toBe('{}');
    });
  });

  describe('localStorage utilities', () => {
    it('should get and set values', () => {
      safeLocalStorageSet('testKey', { value: 123 });
      const result = safeLocalStorageGet('testKey', null);
      expect(result).toEqual({ value: 123 });
    });

    it('should return fallback for missing keys', () => {
      const result = safeLocalStorageGet('nonexistent', 'default');
      expect(result).toBe('default');
    });

    it('should remove values', () => {
      safeLocalStorageSet('testKey', 'value');
      safeLocalStorageRemove('testKey');
      const result = safeLocalStorageGet('testKey', null);
      expect(result).toBeNull();
    });
  });

  describe('Result type utilities', () => {
    it('should create ok result', () => {
      const result = ok(42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(42);
      }
    });

    it('should create err result', () => {
      const error = new Error('Test');
      const result = err(error);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(error);
      }
    });
  });

  describe('Number utilities', () => {
    it('should parse valid integers', () => {
      expect(safeParseInt('42', 0)).toBe(42);
    });

    it('should return fallback for invalid integers', () => {
      expect(safeParseInt('invalid', 10)).toBe(10);
    });

    it('should parse valid floats', () => {
      expect(safeParseFloat('3.14', 0)).toBeCloseTo(3.14);
    });

    it('should return fallback for invalid floats', () => {
      expect(safeParseFloat('invalid', 1.5)).toBe(1.5);
    });

    it('should clamp values to range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('Type guards', () => {
    it('should identify errors', () => {
      expect(isError(new Error('test'))).toBe(true);
      expect(isError('not an error')).toBe(false);
    });

    it('should identify strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString(42)).toBe(false);
    });

    it('should identify numbers', () => {
      expect(isNumber(42)).toBe(true);
      expect(isNumber('42')).toBe(false);
      expect(isNumber(NaN)).toBe(false);
    });

    it('should identify objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
    });

    it('should identify arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray({})).toBe(false);
    });
  });

  describe('Assertions', () => {
    it('should pass for defined values', () => {
      expect(() => assertDefined('value')).not.toThrow();
    });

    it('should throw for undefined values', () => {
      expect(() => assertDefined(undefined)).toThrow();
      expect(() => assertDefined(null)).toThrow();
    });

    it('should pass for valid numbers', () => {
      expect(() => assertNumber(42)).not.toThrow();
    });

    it('should throw for non-numbers', () => {
      expect(() => assertNumber('42')).toThrow();
      expect(() => assertNumber(NaN)).toThrow();
    });

    it('should pass for valid strings', () => {
      expect(() => assertString('hello')).not.toThrow();
    });

    it('should throw for non-strings', () => {
      expect(() => assertString(42)).toThrow();
    });
  });
});
