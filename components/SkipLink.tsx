import React from 'react';

interface SkipLinkProps {
    /** The target element id to skip to (without #) */
    targetId: string;
    /** The link text */
    children?: React.ReactNode;
    /** Additional CSS classes */
    className?: string;
}

/**
 * SkipLink - Accessibility component for keyboard navigation
 *
 * Allows keyboard users to skip directly to main content,
 * bypassing navigation and other repetitive elements.
 *
 * The link is visually hidden until focused.
 *
 * @example
 * ```tsx
 * // In your App.tsx or Layout component:
 * <SkipLink targetId="main-content" />
 *
 * // Then on your main content:
 * <main id="main-content" tabIndex={-1}>...</main>
 * ```
 */
const SkipLink: React.FC<SkipLinkProps> = ({
    targetId,
    children = '跳到主要内容',
    className = '',
}) => {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
            // Set focus to the target element
            target.focus();
            // Scroll to the target
            target.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href={`#${targetId}`}
            onClick={handleClick}
            className={`
                fixed top-0 left-0 z-[9999]
                px-4 py-2 m-2
                bg-orange-500 text-white font-medium
                rounded-lg shadow-lg
                transform -translate-y-full
                focus:translate-y-0
                transition-transform duration-200
                outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2
                ${className}
            `}
        >
            {children}
        </a>
    );
};

export default SkipLink;
