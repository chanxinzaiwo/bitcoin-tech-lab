/**
 * Web Vitals and Performance Analytics Utilities
 *
 * This module provides Core Web Vitals monitoring and performance tracking.
 * Metrics are logged in development and can be sent to analytics services in production.
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

// Types for analytics
export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

export interface PerformanceReport {
  timestamp: number;
  url: string;
  metrics: WebVitalsMetric[];
}

// Thresholds for Core Web Vitals (based on Google's recommendations)
export const WEB_VITALS_THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

/**
 * Get the rating for a metric value
 */
function getRating(
  name: string,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[name as keyof typeof WEB_VITALS_THRESHOLDS];
  if (!thresholds) return 'good';

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Format metric value for display
 */
export function formatMetricValue(name: string, value: number): string {
  switch (name) {
    case 'CLS':
      return value.toFixed(3);
    case 'FCP':
    case 'LCP':
    case 'TTFB':
    case 'INP':
      return `${Math.round(value)}ms`;
    default:
      return value.toFixed(2);
  }
}

/**
 * Get color class based on rating
 */
export function getMetricColorClass(rating: 'good' | 'needs-improvement' | 'poor'): string {
  switch (rating) {
    case 'good':
      return 'text-green-500';
    case 'needs-improvement':
      return 'text-yellow-500';
    case 'poor':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

// Storage for collected metrics
const collectedMetrics: WebVitalsMetric[] = [];

/**
 * Default metric handler - logs to console in development
 */
function handleMetric(metric: Metric): void {
  const webVitalsMetric: WebVitalsMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType || 'unknown',
  };

  collectedMetrics.push(webVitalsMetric);

  // Log in development
  if (import.meta.env.DEV) {
    const formatted = formatMetricValue(metric.name, metric.value);
    const emoji = webVitalsMetric.rating === 'good' ? '✅' :
                  webVitalsMetric.rating === 'needs-improvement' ? '⚠️' : '❌';

    console.log(
      `${emoji} ${metric.name}: ${formatted} (${webVitalsMetric.rating})`
    );
  }
}

/**
 * Custom analytics reporter type
 */
export type AnalyticsReporter = (metric: WebVitalsMetric) => void;

// Custom reporter function
let customReporter: AnalyticsReporter | null = null;

/**
 * Set a custom analytics reporter
 * This can be used to send metrics to your analytics service
 *
 * @example
 * setAnalyticsReporter((metric) => {
 *   gtag('event', metric.name, {
 *     value: Math.round(metric.value),
 *     event_category: 'Web Vitals',
 *     event_label: metric.id,
 *     non_interaction: true,
 *   });
 * });
 */
export function setAnalyticsReporter(reporter: AnalyticsReporter): void {
  customReporter = reporter;
}

/**
 * Combined metric handler that uses both default and custom reporters
 */
function reportMetric(metric: Metric): void {
  handleMetric(metric);

  if (customReporter) {
    const webVitalsMetric: WebVitalsMetric = {
      name: metric.name,
      value: metric.value,
      rating: getRating(metric.name, metric.value),
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType || 'unknown',
    };
    customReporter(webVitalsMetric);
  }
}

/**
 * Initialize Web Vitals monitoring
 * Call this once when your app starts
 */
export function initWebVitals(): void {
  onCLS(reportMetric);
  onFCP(reportMetric);
  onINP(reportMetric);
  onLCP(reportMetric);
  onTTFB(reportMetric);
}

/**
 * Get all collected metrics
 */
export function getCollectedMetrics(): WebVitalsMetric[] {
  return [...collectedMetrics];
}

/**
 * Generate a performance report
 */
export function generatePerformanceReport(): PerformanceReport {
  return {
    timestamp: Date.now(),
    url: window.location.href,
    metrics: getCollectedMetrics(),
  };
}

/**
 * Check if the page meets Core Web Vitals thresholds
 */
export function assessCoreWebVitals(): {
  passed: boolean;
  details: Record<string, { value: number; rating: string; passed: boolean }>;
} {
  const metrics = getCollectedMetrics();
  const details: Record<string, { value: number; rating: string; passed: boolean }> = {};

  // Core Web Vitals are LCP, INP (replaced FID), and CLS
  const coreMetrics = ['LCP', 'INP', 'CLS'];
  let allPassed = true;

  for (const metricName of coreMetrics) {
    const metric = metrics.find((m) => m.name === metricName);
    if (metric) {
      const passed = metric.rating === 'good';
      details[metricName] = {
        value: metric.value,
        rating: metric.rating,
        passed,
      };
      if (!passed) allPassed = false;
    }
  }

  return { passed: allPassed, details };
}

/**
 * Performance mark utility
 */
export function markPerformance(name: string): void {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Performance measure utility
 */
export function measurePerformance(
  name: string,
  startMark: string,
  endMark?: string
): number | null {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      const measure = performance.measure(name, startMark, endMark);
      return measure.duration;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Log a custom performance metric
 */
export function logCustomMetric(name: string, value: number, unit = 'ms'): void {
  if (import.meta.env.DEV) {
    console.log(`📊 ${name}: ${value.toFixed(2)}${unit}`);
  }
}
