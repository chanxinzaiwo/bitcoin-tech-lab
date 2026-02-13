/**
 * Accessibility utilities for Bitcoin Tech Lab
 *
 * Provides helpers for:
 * - Screen reader announcements
 * - Focus management
 * - Keyboard navigation
 * - ARIA attributes
 */

// ========================================
// Screen Reader Announcements
// ========================================

let announceElement: HTMLElement | null = null;

/**
 * Initialize the screen reader announcer element
 * Call this once when the app mounts
 */
export function initAnnouncer(): void {
    if (typeof window === 'undefined') return;

    // Check if announcer already exists
    if (document.getElementById('sr-announcer')) return;

    // Create the announcer element
    announceElement = document.createElement('div');
    announceElement.id = 'sr-announcer';
    announceElement.setAttribute('role', 'status');
    announceElement.setAttribute('aria-live', 'polite');
    announceElement.setAttribute('aria-atomic', 'true');

    // Visually hide but keep accessible to screen readers
    Object.assign(announceElement.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
    });

    document.body.appendChild(announceElement);
}

/**
 * Announce a message to screen readers
 *
 * @param message - The message to announce
 * @param priority - 'polite' (default) or 'assertive' for urgent announcements
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (typeof window === 'undefined') return;

    // Initialize if not done yet
    if (!announceElement) {
        initAnnouncer();
    }

    if (!announceElement) return;

    // Set the priority
    announceElement.setAttribute('aria-live', priority);

    // Clear and set message (this triggers the announcement)
    announceElement.textContent = '';
    // Use setTimeout to ensure the DOM updates trigger the announcement
    setTimeout(() => {
        if (announceElement) {
            announceElement.textContent = message;
        }
    }, 50);
}

// ========================================
// Focus Management
// ========================================

/**
 * Focus an element by ID
 * Useful for programmatic focus after route changes or modal opens
 */
export function focusElement(elementId: string): void {
    if (typeof window === 'undefined') return;

    const element = document.getElementById(elementId);
    if (element) {
        // Make element focusable if it isn't already
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '-1');
        }
        element.focus();
    }
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors));
}

/**
 * Trap focus within a container (useful for modals)
 * Returns a cleanup function to remove the trap
 */
export function trapFocus(container: HTMLElement): () => void {
    const focusableElements = getFocusableElements(container);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus the first element
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
            // Shift + Tab: go backwards
            if (document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable?.focus();
            }
        } else {
            // Tab: go forwards
            if (document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable?.focus();
            }
        }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
        container.removeEventListener('keydown', handleKeyDown);
    };
}

// ========================================
// Keyboard Navigation
// ========================================

/**
 * Check if an event is an activation key (Enter or Space)
 */
export function isActivationKey(event: KeyboardEvent): boolean {
    return event.key === 'Enter' || event.key === ' ';
}

/**
 * Check if an event is an arrow key
 */
export function isArrowKey(event: KeyboardEvent): 'up' | 'down' | 'left' | 'right' | null {
    switch (event.key) {
        case 'ArrowUp':
            return 'up';
        case 'ArrowDown':
            return 'down';
        case 'ArrowLeft':
            return 'left';
        case 'ArrowRight':
            return 'right';
        default:
            return null;
    }
}

/**
 * Create a keyboard handler for list navigation
 * Handles arrow keys, Home, End, and activation
 */
export function createListKeyHandler(options: {
    onSelect?: (index: number) => void;
    onActivate?: (index: number) => void;
    itemCount: number;
    currentIndex: number;
    orientation?: 'horizontal' | 'vertical';
    loop?: boolean;
}): (event: KeyboardEvent) => void {
    const {
        onSelect,
        onActivate,
        itemCount,
        currentIndex,
        orientation = 'vertical',
        loop = true,
    } = options;

    return (event: KeyboardEvent) => {
        let newIndex = currentIndex;

        const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
        const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';

        switch (event.key) {
            case prevKey:
                event.preventDefault();
                newIndex = currentIndex - 1;
                if (newIndex < 0) {
                    newIndex = loop ? itemCount - 1 : 0;
                }
                break;

            case nextKey:
                event.preventDefault();
                newIndex = currentIndex + 1;
                if (newIndex >= itemCount) {
                    newIndex = loop ? 0 : itemCount - 1;
                }
                break;

            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;

            case 'End':
                event.preventDefault();
                newIndex = itemCount - 1;
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                onActivate?.(currentIndex);
                return;

            default:
                return;
        }

        if (newIndex !== currentIndex) {
            onSelect?.(newIndex);
        }
    };
}

// ========================================
// ARIA Helpers
// ========================================

/**
 * Generate ARIA props for a button that opens a menu/popover
 */
export function getMenuButtonProps(isOpen: boolean, menuId: string) {
    return {
        'aria-expanded': isOpen,
        'aria-haspopup': 'menu' as const,
        'aria-controls': menuId,
    };
}

/**
 * Generate ARIA props for a tab
 */
export function getTabProps(isSelected: boolean, tabId: string, panelId: string) {
    return {
        role: 'tab' as const,
        id: tabId,
        'aria-selected': isSelected,
        'aria-controls': panelId,
        tabIndex: isSelected ? 0 : -1,
    };
}

/**
 * Generate ARIA props for a tab panel
 */
export function getTabPanelProps(tabId: string, panelId: string, isHidden: boolean = false) {
    return {
        role: 'tabpanel' as const,
        id: panelId,
        'aria-labelledby': tabId,
        hidden: isHidden,
        tabIndex: 0,
    };
}

/**
 * Generate ARIA props for progress indicators
 */
export function getProgressProps(current: number, max: number, label?: string) {
    return {
        role: 'progressbar' as const,
        'aria-valuenow': current,
        'aria-valuemin': 0,
        'aria-valuemax': max,
        'aria-label': label,
    };
}

// ========================================
// Visually Hidden (for screen readers only)
// ========================================

/**
 * CSS class for visually hidden elements (accessible to screen readers)
 */
export const srOnlyClass = 'sr-only';

/**
 * Inline styles for visually hidden elements
 */
export const srOnlyStyles: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
};

// ========================================
// Reduced Motion
// ========================================

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation duration based on user's motion preference
 * Returns 0 if user prefers reduced motion
 */
export function getAnimationDuration(normalDuration: number): number {
    return prefersReducedMotion() ? 0 : normalDuration;
}
