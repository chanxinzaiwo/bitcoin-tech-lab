import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useModals } from '../../hooks/useModals';

describe('useModals hook', () => {
  it('should initialize with all modals closed', () => {
    const { result } = renderHook(() => useModals());

    expect(result.current.modals.shortcuts).toBe(false);
    expect(result.current.modals.learningPath).toBe(false);
    expect(result.current.modals.glossary).toBe(false);
    expect(result.current.modals.achievements).toBe(false);
  });

  it('should open a modal', () => {
    const { result } = renderHook(() => useModals());

    act(() => {
      result.current.open('shortcuts');
    });

    expect(result.current.modals.shortcuts).toBe(true);
    expect(result.current.modals.learningPath).toBe(false);
  });

  it('should close a modal', () => {
    const { result } = renderHook(() => useModals());

    act(() => {
      result.current.open('shortcuts');
    });
    expect(result.current.modals.shortcuts).toBe(true);

    act(() => {
      result.current.close('shortcuts');
    });
    expect(result.current.modals.shortcuts).toBe(false);
  });

  it('should toggle a modal', () => {
    const { result } = renderHook(() => useModals());

    act(() => {
      result.current.toggle('glossary');
    });
    expect(result.current.modals.glossary).toBe(true);

    act(() => {
      result.current.toggle('glossary');
    });
    expect(result.current.modals.glossary).toBe(false);
  });

  it('should close all modals', () => {
    const { result } = renderHook(() => useModals());

    act(() => {
      result.current.open('shortcuts');
      result.current.open('learningPath');
      result.current.open('glossary');
    });

    expect(result.current.modals.shortcuts).toBe(true);
    expect(result.current.modals.learningPath).toBe(true);
    expect(result.current.modals.glossary).toBe(true);

    act(() => {
      result.current.closeAll();
    });

    expect(result.current.modals.shortcuts).toBe(false);
    expect(result.current.modals.learningPath).toBe(false);
    expect(result.current.modals.glossary).toBe(false);
    expect(result.current.modals.achievements).toBe(false);
  });

  it('should handle multiple modals independently', () => {
    const { result } = renderHook(() => useModals());

    act(() => {
      result.current.open('shortcuts');
      result.current.open('achievements');
    });

    expect(result.current.modals.shortcuts).toBe(true);
    expect(result.current.modals.achievements).toBe(true);
    expect(result.current.modals.learningPath).toBe(false);

    act(() => {
      result.current.close('shortcuts');
    });

    expect(result.current.modals.shortcuts).toBe(false);
    expect(result.current.modals.achievements).toBe(true);
  });
});
