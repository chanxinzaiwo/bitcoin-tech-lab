/**
 * Storage utilities with robust error handling
 *
 * Provides a wrapper around localStorage with:
 * - Quota exceeded handling
 * - JSON parsing error recovery
 * - Type-safe getters/setters
 * - Fallback to in-memory storage when localStorage is unavailable
 */

// In-memory fallback storage for when localStorage is unavailable
const memoryStorage: Record<string, string> = {};

// Storage error types
export type StorageErrorType =
    | 'quota_exceeded'
    | 'json_parse_error'
    | 'json_stringify_error'
    | 'storage_unavailable'
    | 'unknown';

export interface StorageError {
    type: StorageErrorType;
    message: string;
    originalError?: Error;
}

export interface StorageResult<T> {
    success: boolean;
    data?: T;
    error?: StorageError;
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch {
        return false;
    }
}

/**
 * Check remaining storage quota (approximate)
 */
export function getStorageQuotaInfo(): { used: number; available: boolean } {
    if (!isLocalStorageAvailable()) {
        return { used: 0, available: false };
    }

    let used = 0;
    for (const key in localStorage) {
        if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
            used += (localStorage.getItem(key)?.length || 0) * 2; // UTF-16 characters = 2 bytes
        }
    }

    return { used, available: true };
}

/**
 * Safely get an item from storage with type safety
 */
export function getItem<T>(key: string, defaultValue: T): StorageResult<T> {
    try {
        // Try localStorage first
        if (isLocalStorageAvailable()) {
            const item = localStorage.getItem(key);

            if (item === null) {
                return { success: true, data: defaultValue };
            }

            try {
                const parsed = JSON.parse(item) as T;
                return { success: true, data: parsed };
            } catch (parseError) {
                console.warn(`[Storage] JSON parse error for key "${key}", using default value:`, parseError);
                // Return default value but indicate there was an error
                return {
                    success: false,
                    data: defaultValue,
                    error: {
                        type: 'json_parse_error',
                        message: `Failed to parse JSON for key "${key}"`,
                        originalError: parseError instanceof Error ? parseError : undefined,
                    },
                };
            }
        }

        // Fallback to memory storage
        const memItem = memoryStorage[key];
        if (memItem === undefined) {
            return { success: true, data: defaultValue };
        }

        try {
            const parsed = JSON.parse(memItem) as T;
            return { success: true, data: parsed };
        } catch {
            return { success: true, data: defaultValue };
        }
    } catch (error) {
        console.error(`[Storage] Error getting item "${key}":`, error);
        return {
            success: false,
            data: defaultValue,
            error: {
                type: 'unknown',
                message: `Failed to get item "${key}"`,
                originalError: error instanceof Error ? error : undefined,
            },
        };
    }
}

/**
 * Safely set an item in storage
 */
export function setItem<T>(key: string, value: T): StorageResult<void> {
    try {
        let stringValue: string;

        try {
            stringValue = JSON.stringify(value);
        } catch (stringifyError) {
            console.error(`[Storage] JSON stringify error for key "${key}":`, stringifyError);
            return {
                success: false,
                error: {
                    type: 'json_stringify_error',
                    message: `Failed to stringify value for key "${key}"`,
                    originalError: stringifyError instanceof Error ? stringifyError : undefined,
                },
            };
        }

        if (isLocalStorageAvailable()) {
            try {
                localStorage.setItem(key, stringValue);
                return { success: true };
            } catch (storageError) {
                // Check if it's a quota exceeded error
                if (isQuotaExceededError(storageError)) {
                    console.warn(`[Storage] Quota exceeded for key "${key}", attempting cleanup...`);

                    // Try to free up space by removing old data
                    const cleaned = attemptStorageCleanup(key);

                    if (cleaned) {
                        try {
                            localStorage.setItem(key, stringValue);
                            return { success: true };
                        } catch {
                            // Still failed, fall through to memory storage
                        }
                    }

                    // Fall back to memory storage
                    memoryStorage[key] = stringValue;
                    return {
                        success: false,
                        error: {
                            type: 'quota_exceeded',
                            message: `Storage quota exceeded for key "${key}", using memory fallback`,
                            originalError: storageError instanceof Error ? storageError : undefined,
                        },
                    };
                }

                throw storageError;
            }
        }

        // Fallback to memory storage
        memoryStorage[key] = stringValue;
        return {
            success: true,
            error: {
                type: 'storage_unavailable',
                message: 'localStorage unavailable, using memory storage',
            },
        };
    } catch (error) {
        console.error(`[Storage] Error setting item "${key}":`, error);
        return {
            success: false,
            error: {
                type: 'unknown',
                message: `Failed to set item "${key}"`,
                originalError: error instanceof Error ? error : undefined,
            },
        };
    }
}

/**
 * Safely remove an item from storage
 */
export function removeItem(key: string): StorageResult<void> {
    try {
        if (isLocalStorageAvailable()) {
            localStorage.removeItem(key);
        }
        delete memoryStorage[key];
        return { success: true };
    } catch (error) {
        console.error(`[Storage] Error removing item "${key}":`, error);
        return {
            success: false,
            error: {
                type: 'unknown',
                message: `Failed to remove item "${key}"`,
                originalError: error instanceof Error ? error : undefined,
            },
        };
    }
}

/**
 * Clear all storage
 */
export function clearStorage(): StorageResult<void> {
    try {
        if (isLocalStorageAvailable()) {
            localStorage.clear();
        }
        Object.keys(memoryStorage).forEach(key => delete memoryStorage[key]);
        return { success: true };
    } catch (error) {
        console.error('[Storage] Error clearing storage:', error);
        return {
            success: false,
            error: {
                type: 'unknown',
                message: 'Failed to clear storage',
                originalError: error instanceof Error ? error : undefined,
            },
        };
    }
}

/**
 * Check if an error is a quota exceeded error
 */
function isQuotaExceededError(error: unknown): boolean {
    if (!(error instanceof Error)) return false;

    // Different browsers have different error names/messages
    const quotaErrorNames = ['QuotaExceededError', 'NS_ERROR_DOM_QUOTA_REACHED'];
    const quotaErrorMessages = ['quota', 'storage'];

    if (quotaErrorNames.includes(error.name)) {
        return true;
    }

    const lowerMessage = error.message.toLowerCase();
    return quotaErrorMessages.some(msg => lowerMessage.includes(msg));
}

/**
 * Attempt to free up storage space
 * Returns true if cleanup was successful
 */
function attemptStorageCleanup(protectedKey: string): boolean {
    if (!isLocalStorageAvailable()) return false;

    try {
        // Find and remove temporary or old data
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key !== protectedKey) {
                // Remove keys that look like temporary data
                if (key.startsWith('temp_') || key.includes('_cache_')) {
                    keysToRemove.push(key);
                }
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));

        return keysToRemove.length > 0;
    } catch {
        return false;
    }
}

/**
 * Storage hook helpers for React components
 */
export function createStorageHook<T>(key: string, defaultValue: T) {
    return {
        get: () => getItem<T>(key, defaultValue),
        set: (value: T) => setItem(key, value),
        remove: () => removeItem(key),
    };
}

// Storage keys used in the application
export const STORAGE_KEYS = {
    PROGRESS: 'bitcoin-tech-lab-progress',
    THEME: 'theme',
    LANGUAGE: 'preferred-language',
    ONBOARDING_COMPLETE: 'onboarding-complete',
    LAST_VISITED_MODULE: 'last-visited-module',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
