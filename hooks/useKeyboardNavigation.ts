import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook for keyboard navigation in lists and grids
 * Provides accessible navigation patterns
 */

export interface UseKeyboardNavigationOptions<T> {
  /** Array of items to navigate */
  items: T[];
  /** Callback when an item is selected */
  onSelect?: (item: T, index: number) => void;
  /** Callback when an item is activated (Enter key) */
  onActivate?: (item: T, index: number) => void;
  /** Initial selected index */
  initialIndex?: number;
  /** Whether navigation should wrap around */
  wrap?: boolean;
  /** Whether to use vertical navigation (ArrowUp/Down) */
  vertical?: boolean;
  /** Whether to use horizontal navigation (ArrowLeft/Right) */
  horizontal?: boolean;
  /** Number of columns for grid navigation */
  columns?: number;
  /** Whether the component is focused */
  isActive?: boolean;
}

export interface UseKeyboardNavigationResult<T> {
  /** Currently selected index */
  selectedIndex: number;
  /** Set the selected index */
  setSelectedIndex: (index: number) => void;
  /** Currently selected item */
  selectedItem: T | undefined;
  /** Props to spread on the container element */
  containerProps: {
    role: string;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    'aria-activedescendant': string | undefined;
  };
  /** Function to get props for each item */
  getItemProps: (index: number) => {
    id: string;
    role: string;
    'aria-selected': boolean;
    tabIndex: number;
    onClick: () => void;
    onDoubleClick: () => void;
  };
  /** Move to next item */
  next: () => void;
  /** Move to previous item */
  prev: () => void;
  /** Move to first item */
  first: () => void;
  /** Move to last item */
  last: () => void;
  /** Activate current item */
  activate: () => void;
}

let idCounter = 0;
const generateId = () => `kb-nav-item-${++idCounter}`;

export function useKeyboardNavigation<T>({
  items,
  onSelect,
  onActivate,
  initialIndex = 0,
  wrap = true,
  vertical = true,
  horizontal = false,
  columns = 1,
  isActive = true,
}: UseKeyboardNavigationOptions<T>): UseKeyboardNavigationResult<T> {
  const [selectedIndex, setSelectedIndex] = useState(
    Math.max(0, Math.min(initialIndex, items.length - 1)),
  );
  const itemIdsRef = useRef<Map<number, string>>(new Map());

  // Generate stable IDs for items
  const getItemId = useCallback((index: number): string => {
    if (!itemIdsRef.current.has(index)) {
      itemIdsRef.current.set(index, generateId());
    }
    return itemIdsRef.current.get(index)!;
  }, []);

  // Update selected index when items change
  useEffect(() => {
    if (selectedIndex >= items.length) {
      setSelectedIndex(Math.max(0, items.length - 1));
    }
  }, [items.length, selectedIndex]);

  // Call onSelect when selection changes
  useEffect(() => {
    if (items[selectedIndex]) {
      onSelect?.(items[selectedIndex], selectedIndex);
    }
  }, [selectedIndex, items, onSelect]);

  const next = useCallback(() => {
    setSelectedIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= items.length) {
        return wrap ? 0 : prev;
      }
      return nextIndex;
    });
  }, [items.length, wrap]);

  const prev = useCallback(() => {
    setSelectedIndex((prev) => {
      const prevIndex = prev - 1;
      if (prevIndex < 0) {
        return wrap ? items.length - 1 : prev;
      }
      return prevIndex;
    });
  }, [items.length, wrap]);

  const first = useCallback(() => {
    setSelectedIndex(0);
  }, []);

  const last = useCallback(() => {
    setSelectedIndex(items.length - 1);
  }, [items.length]);

  const moveUp = useCallback(() => {
    setSelectedIndex((prev) => {
      const nextIndex = prev - columns;
      if (nextIndex < 0) {
        if (wrap) {
          const lastRowStart = Math.floor((items.length - 1) / columns) * columns;
          const targetIndex = lastRowStart + (prev % columns);
          return targetIndex < items.length ? targetIndex : items.length - 1;
        }
        return prev;
      }
      return nextIndex;
    });
  }, [columns, items.length, wrap]);

  const moveDown = useCallback(() => {
    setSelectedIndex((prev) => {
      const nextIndex = prev + columns;
      if (nextIndex >= items.length) {
        if (wrap) {
          return prev % columns;
        }
        return prev;
      }
      return nextIndex;
    });
  }, [columns, items.length, wrap]);

  const activate = useCallback(() => {
    if (items[selectedIndex]) {
      onActivate?.(items[selectedIndex], selectedIndex);
    }
  }, [items, selectedIndex, onActivate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isActive) return;

      switch (e.key) {
        case 'ArrowDown':
          if (vertical) {
            e.preventDefault();
            if (columns > 1) {
              moveDown();
            } else {
              next();
            }
          }
          break;
        case 'ArrowUp':
          if (vertical) {
            e.preventDefault();
            if (columns > 1) {
              moveUp();
            } else {
              prev();
            }
          }
          break;
        case 'ArrowRight':
          if (horizontal || columns > 1) {
            e.preventDefault();
            next();
          }
          break;
        case 'ArrowLeft':
          if (horizontal || columns > 1) {
            e.preventDefault();
            prev();
          }
          break;
        case 'Home':
          e.preventDefault();
          first();
          break;
        case 'End':
          e.preventDefault();
          last();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          activate();
          break;
      }
    },
    [isActive, vertical, horizontal, columns, next, prev, first, last, activate, moveUp, moveDown],
  );

  const containerProps = {
    role: 'listbox' as const,
    tabIndex: isActive ? 0 : -1,
    onKeyDown: handleKeyDown,
    'aria-activedescendant': items.length > 0 ? getItemId(selectedIndex) : undefined,
  };

  const getItemProps = useCallback(
    (index: number) => ({
      id: getItemId(index),
      role: 'option' as const,
      'aria-selected': index === selectedIndex,
      tabIndex: -1,
      onClick: () => {
        setSelectedIndex(index);
        onActivate?.(items[index], index);
      },
      onDoubleClick: () => {
        setSelectedIndex(index);
        onActivate?.(items[index], index);
      },
    }),
    [selectedIndex, getItemId, items, onActivate],
  );

  return {
    selectedIndex,
    setSelectedIndex,
    selectedItem: items[selectedIndex],
    containerProps,
    getItemProps,
    next,
    prev,
    first,
    last,
    activate,
  };
}

/**
 * Hook for roving tabindex pattern (useful for toolbars)
 */
export interface UseRovingTabIndexOptions {
  /** Number of items */
  itemCount: number;
  /** Initial focused index */
  initialIndex?: number;
  /** Whether navigation is vertical */
  vertical?: boolean;
  /** Whether to wrap around */
  wrap?: boolean;
}

export interface UseRovingTabIndexResult {
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  getTabIndex: (index: number) => 0 | -1;
  handleKeyDown: (e: React.KeyboardEvent, index: number) => void;
}

export function useRovingTabIndex({
  itemCount,
  initialIndex = 0,
  vertical = false,
  wrap = true,
}: UseRovingTabIndexOptions): UseRovingTabIndexResult {
  const [focusedIndex, setFocusedIndex] = useState(initialIndex);

  const getTabIndex = useCallback(
    (index: number): 0 | -1 => (index === focusedIndex ? 0 : -1),
    [focusedIndex],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
      const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';

      let newIndex = currentIndex;

      switch (e.key) {
        case nextKey:
          e.preventDefault();
          newIndex = currentIndex + 1;
          if (newIndex >= itemCount) {
            newIndex = wrap ? 0 : currentIndex;
          }
          break;
        case prevKey:
          e.preventDefault();
          newIndex = currentIndex - 1;
          if (newIndex < 0) {
            newIndex = wrap ? itemCount - 1 : currentIndex;
          }
          break;
        case 'Home':
          e.preventDefault();
          newIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          newIndex = itemCount - 1;
          break;
        default:
          return;
      }

      setFocusedIndex(newIndex);

      // Focus the new element
      const focusableElements = (e.currentTarget.parentElement?.querySelectorAll(
        '[tabindex]',
      ) || []) as NodeListOf<HTMLElement>;
      focusableElements[newIndex]?.focus();
    },
    [itemCount, vertical, wrap],
  );

  return {
    focusedIndex,
    setFocusedIndex,
    getTabIndex,
    handleKeyDown,
  };
}
