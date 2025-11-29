// utility functions tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { currencyNumber, getNameInitials, getDateColor, getRandomColorFromString } from '../index';

describe('currencyNumber', () => {
  it('should format number as USD currency', () => {
    expect(currencyNumber(1234.56)).toBe('$1,234.56');
    expect(currencyNumber(1000)).toBe('$1,000.00');
    expect(currencyNumber(0)).toBe('$0.00');
  });

  it('should handle negative numbers', () => {
    expect(currencyNumber(-100)).toBe('-$100.00');
  });

  it('should handle large numbers', () => {
    expect(currencyNumber(1000000)).toBe('$1,000,000.00');
  });

  it('should accept custom options', () => {
    const result = currencyNumber(1234.56, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    expect(result).toBe('$1,235');
  });

  it('should fallback to string conversion if Intl is not available', () => {
    const originalIntl = global.Intl;
    // @ts-expect-error - testing fallback
    global.Intl = undefined;

    expect(currencyNumber(1234)).toBe('1234');

    global.Intl = originalIntl;
  });
});

describe('getNameInitials', () => {
  it('should extract initials from full name', () => {
    expect(getNameInitials('John Doe')).toBe('JD');
    expect(getNameInitials('Jane Smith')).toBe('JS');
  });

  it('should handle single name', () => {
    expect(getNameInitials('Madonna')).toBe('M');
  });

  it('should handle multiple words', () => {
    expect(getNameInitials('John Michael Smith')).toBe('JM');
  });

  it('should filter out special characters', () => {
    // "John-Doe O'Brien" splits to ["John-Doe", "O'Brien"], initials are "J" and "O" = "JO"
    expect(getNameInitials("John-Doe O'Brien")).toBe('JO');
    // note: getNameInitials filters non-alphabetic chars with regex /[^a-zA-Z]/g
    // accented characters are filtered out, so "José María" becomes "J" or "JM" depending on implementation
    const result = getNameInitials('José María');
    expect(result).toMatch(/^[A-Z]+$/);
  });

  it('should respect count parameter', () => {
    expect(getNameInitials('John Michael Smith', 3)).toBe('JMS');
    expect(getNameInitials('John Doe', 1)).toBe('J');
  });

  it('should uppercase initials', () => {
    expect(getNameInitials('john doe')).toBe('JD');
  });

  it('should handle empty string', () => {
    expect(getNameInitials('')).toBe('');
  });

  it('should handle names with numbers', () => {
    expect(getNameInitials('John 2 Doe')).toBe('JD');
  });
});

describe('getRandomColorFromString', () => {
  it('should return a color from the palette', () => {
    const colors = [
      '#ff9c6e',
      '#ff7875',
      '#ffc069',
      '#ffd666',
      '#fadb14',
      '#95de64',
      '#5cdbd3',
      '#69c0ff',
      '#85a5ff',
      '#b37feb',
      '#ff85c0',
    ];

    const result = getRandomColorFromString('test');
    expect(colors).toContain(result);
  });

  it('should return consistent color for same string', () => {
    const result1 = getRandomColorFromString('test');
    const result2 = getRandomColorFromString('test');
    expect(result1).toBe(result2);
  });

  it('should return different colors for different strings', () => {
    const result1 = getRandomColorFromString('test1');
    const result2 = getRandomColorFromString('test2');
    expect(result1).not.toBe(result2);
  });

  it('should handle empty string', () => {
    const result = getRandomColorFromString('');
    expect(typeof result).toBe('string');
    expect(result.startsWith('#')).toBe(true);
  });

  it('should handle special characters', () => {
    const result = getRandomColorFromString('test@#$%');
    expect(typeof result).toBe('string');
    expect(result.startsWith('#')).toBe(true);
  });
});

describe('getDateColor', () => {
  it('should return error for past dates', () => {
    // use a past date string
    const pastDate = '2020-01-01';
    const result = getDateColor({ date: pastDate });
    // dayjs will compare with today, so past dates should return "error"
    expect(result).toBe('error');
  });

  it('should return warning for dates within 3 days', () => {
    // use a date 2 days from now
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateString = tomorrow.toISOString().split('T')[0];

    const result = getDateColor({ date: dateString });
    expect(result).toBe('warning');
  });

  it('should return default for future dates', () => {
    // use a date far in the future
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateString = futureDate.toISOString().split('T')[0];
    const result = getDateColor({ date: dateString });
    expect(result).toBe('default');
  });

  it('should use custom defaultColor when provided', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const dateString = futureDate.toISOString().split('T')[0];
    const result = getDateColor({
       date: dateString,
      defaultColor: 'success',
    });
    expect(result).toBe('success');
  });
});
