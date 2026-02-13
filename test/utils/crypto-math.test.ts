import { describe, it, expect } from 'vitest';
import { calculateY, addPoints, scalarMult, Point } from '../../utils/crypto-math';

describe('crypto-math utilities', () => {
  describe('calculateY', () => {
    it('should calculate Y for positive values', () => {
      // For curve y² = x³ + 0x + 7 (Bitcoin's secp256k1)
      const y = calculateY(2, 0, 7);
      // y² = 8 + 7 = 15, so y = sqrt(15) ≈ 3.873
      expect(y).toBeCloseTo(Math.sqrt(15), 5);
    });

    it('should return NaN for negative values under the square root', () => {
      // x = -2: y² = -8 + 7 = -1 (negative, no real solution)
      const y = calculateY(-2, 0, 7);
      expect(y).toBeNaN();
    });

    it('should work with different curve parameters', () => {
      // y² = x³ - x + 1 (a = -1, b = 1)
      const y = calculateY(1, -1, 1);
      // y² = 1 - 1 + 1 = 1, so y = 1
      expect(y).toBe(1);
    });

    it('should return 0 when result is 0', () => {
      // y² = x³ + ax + b = 0
      const y = calculateY(0, 0, 0);
      expect(y).toBe(0);
    });
  });

  describe('addPoints', () => {
    it('should return p2 when p1 is null', () => {
      const p2: Point = { x: 1, y: 2 };
      const result = addPoints(null, p2, 0);
      expect(result).toEqual(p2);
    });

    it('should return p1 when p2 is null', () => {
      const p1: Point = { x: 1, y: 2 };
      const result = addPoints(p1, null, 0);
      expect(result).toEqual(p1);
    });

    it('should add two different points', () => {
      const p1: Point = { x: -1.8, y: Math.sqrt((-1.8) ** 3 + 7) };
      const p2: Point = { x: 0.5, y: Math.sqrt(0.5 ** 3 + 7) };
      const result = addPoints(p1, p2, 0);
      expect(result).not.toBeNull();
      expect(result?.x).toBeDefined();
      expect(result?.y).toBeDefined();
    });

    it('should double a point (when p1 equals p2)', () => {
      const p: Point = { x: 1, y: Math.sqrt(8) };
      const result = addPoints(p, { ...p }, 0);
      expect(result).not.toBeNull();
    });

    it('should return null when doubling with y = 0', () => {
      const p: Point = { x: 1, y: 0 };
      const result = addPoints(p, { ...p }, 0);
      expect(result).toBeNull();
    });
  });

  describe('scalarMult', () => {
    it('should return the same point for k = 1', () => {
      const p: Point = { x: 1, y: 2 };
      const result = scalarMult(1, p, 0);
      expect(result).toEqual(p);
    });

    it('should compute scalar multiplication for k > 1', () => {
      const p: Point = { x: 1, y: Math.sqrt(8) };
      const result = scalarMult(3, p, 0);
      expect(result).not.toBeNull();
      expect(result?.x).toBeDefined();
      expect(result?.y).toBeDefined();
    });

    it('should compute different results for different k values', () => {
      const p: Point = { x: 1, y: Math.sqrt(8) };
      const result2 = scalarMult(2, p, 0);
      const result3 = scalarMult(3, p, 0);
      expect(result2?.x).not.toBe(result3?.x);
    });
  });
});
