import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimeout, useDebounce, useCountdown } from '../../hooks/useTimeout';

describe('useTimeout hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should set and execute a timeout', () => {
    const { result } = renderHook(() => useTimeout());
    const callback = vi.fn();

    act(() => {
      result.current.set(callback, 1000);
    });

    expect(result.current.isPending).toBe(true);
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(result.current.isPending).toBe(false);
  });

  it('should clear a timeout', () => {
    const { result } = renderHook(() => useTimeout());
    const callback = vi.fn();

    act(() => {
      result.current.set(callback, 1000);
    });

    expect(result.current.isPending).toBe(true);

    act(() => {
      result.current.clear();
    });

    expect(result.current.isPending).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should replace previous timeout when setting new one', () => {
    const { result } = renderHook(() => useTimeout());
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    act(() => {
      result.current.set(callback1, 1000);
    });

    act(() => {
      vi.advanceTimersByTime(500);
      result.current.set(callback2, 1000);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should cleanup on unmount', () => {
    const { result, unmount } = renderHook(() => useTimeout());
    const callback = vi.fn();

    act(() => {
      result.current.set(callback, 1000);
    });

    unmount();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });
});

describe('useDebounce hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should debounce function calls', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    act(() => {
      result.current();
      result.current();
      result.current();
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset timer on each call', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 300));

    act(() => {
      result.current();
    });

    act(() => {
      vi.advanceTimersByTime(200);
      result.current();
    });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('useCountdown hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should start countdown', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.start(5);
    });

    expect(result.current.seconds).toBe(5);
    expect(result.current.isRunning).toBe(true);
  });

  it('should decrement seconds', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.start(5);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(4);
  });

  it('should pause countdown', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.start(5);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
      result.current.pause();
    });

    expect(result.current.seconds).toBe(4);
    expect(result.current.isRunning).toBe(false);

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.seconds).toBe(4);
  });

  it('should resume countdown', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.start(5);
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(4);

    act(() => {
      result.current.pause();
    });

    expect(result.current.isRunning).toBe(false);

    act(() => {
      result.current.resume();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(3);
    expect(result.current.isRunning).toBe(true);
  });

  it('should call onComplete when countdown reaches 0', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useCountdown(onComplete));

    act(() => {
      result.current.start(2);
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.seconds).toBe(0);
    expect(onComplete).toHaveBeenCalled();
  });

  it('should reset countdown', () => {
    const { result } = renderHook(() => useCountdown());

    act(() => {
      result.current.start(5);
      vi.advanceTimersByTime(2000);
      result.current.reset();
    });

    expect(result.current.seconds).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });
});
