import React, { Component, Suspense, lazy, memo, useMemo, useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Performance monitoring utilities
class PerformanceOptimizer {
  static observer = null;
  static metrics = {
    componentRenders: 0,
    memoryUsage: 0,
    renderTime: 0,
    lastUpdate: Date.now()
  };

  // Bundle splitting and lazy loading
  static createLazyComponent = (importFn, fallback = <div>Loading...</div>) => {
    const LazyComponent = lazy(importFn);
    
    return memo((props) => (
      <Suspense fallback={fallback}>
        <ErrorBoundary
          fallback={<div>Something went wrong loading this component.</div>}
          onError={(error, errorInfo) => {
            console.error('Lazy component error:', error, errorInfo);
            // Send to monitoring service
            if (window.gtag) {
              window.gtag('event', 'exception', {
                description: error.toString(),
                fatal: false
              });
            }
          }}
        >
          <LazyComponent {...props} />
        </ErrorBoundary>
      </Suspense>
    ));
  };

  // Intersection Observer for viewport-based rendering
  static useIntersectionObserver = (ref, options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setIsIntersecting(entry.isIntersecting),
        {
          threshold: 0.1,
          rootMargin: '50px',
          ...options
        }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    }, [ref, options]);

    return isIntersecting;
  };

  // Memory-efficient component wrapper
  static withPerformanceMonitoring = (WrappedComponent) => {
    return memo((props) => {
      const startTime = performance.now();

      useEffect(() => {
        const endTime = performance.now();
        PerformanceOptimizer.metrics.renderTime = endTime - startTime;
        PerformanceOptimizer.metrics.componentRenders++;
        PerformanceOptimizer.metrics.lastUpdate = Date.now();

        // Track memory usage
        if (performance.memory) {
          PerformanceOptimizer.metrics.memoryUsage = performance.memory.usedJSHeapSize;
        }
      });

      return <WrappedComponent {...props} />;
    });
  };

  // Debounced function utility
  static useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  // Throttled function utility
  static useThrottle = (callback, delay) => {
    const [lastCall, setLastCall] = useState(0);

    return useCallback(
      (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          setLastCall(now);
          return callback(...args);
        }
      },
      [callback, delay, lastCall]
    );
  };

  // Virtual scrolling for large lists
  static VirtualizedList = memo(({ items, itemHeight = 50, containerHeight = 400, renderItem }) => {
    const [scrollTop, setScrollTop] = useState(0);
    
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    const visibleItems = useMemo(() => 
      items.slice(visibleStart, visibleEnd).map((item, index) => ({
        ...item,
        index: visibleStart + index
      })),
      [items, visibleStart, visibleEnd]
    );

    const totalHeight = items.length * itemHeight;
    const offsetY = visibleStart * itemHeight;

    return (
      <div
        style={{
          height: containerHeight,
          overflow: 'auto',
          position: 'relative'
        }}
        onScroll={(e) => setScrollTop(e.target.scrollTop)}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0
            }}
          >
            {visibleItems.map((item) => (
              <div
                key={item.index}
                style={{ height: itemHeight }}
              >
                {renderItem(item, item.index)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  });

  // Image lazy loading with progressive enhancement
  static LazyImage = memo(({ src, alt, placeholder, className, ...props }) => {
    const [imageSrc, setImageSrc] = useState(placeholder);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isError, setIsError] = useState(false);
    const imgRef = React.useRef();
    const isInView = PerformanceOptimizer.useIntersectionObserver(imgRef);

    useEffect(() => {
      if (isInView && src) {
        const img = new Image();
        img.onload = () => {
          setImageSrc(src);
          setIsLoaded(true);
        };
        img.onerror = () => {
          setIsError(true);
        };
        img.src = src;
      }
    }, [isInView, src]);

    return (
      <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
        <img
          src={imageSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-50'
          }`}
          {...props}
        />
        {!isLoaded && !isError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {isError && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
            Failed to load image
          </div>
        )}
      </div>
    );
  });

  // Bundle analyzer
  static analyzeBundleSize = () => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    Promise.all([
      ...scripts.map(script => 
        fetch(script.src, { method: 'HEAD' })
          .then(response => ({
            type: 'script',
            url: script.src,
            size: response.headers.get('content-length') || 'unknown'
          }))
          .catch(() => ({ type: 'script', url: script.src, size: 'error' }))
      ),
      ...styles.map(style =>
        fetch(style.href, { method: 'HEAD' })
          .then(response => ({
            type: 'style',
            url: style.href,
            size: response.headers.get('content-length') || 'unknown'
          }))
          .catch(() => ({ type: 'style', url: style.href, size: 'error' }))
      )
    ]).then(results => {
      console.group('Bundle Analysis');
      results.forEach(result => {
        console.log(`${result.type}: ${result.url} (${result.size} bytes)`);
      });
      console.groupEnd();
    });
  };

  // Performance monitoring dashboard
  static PerformanceDashboard = () => {
    const [metrics, setMetrics] = useState(PerformanceOptimizer.metrics);

    useEffect(() => {
      const interval = setInterval(() => {
        setMetrics({ ...PerformanceOptimizer.metrics });
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono z-50">
        <div className="mb-2 font-bold">Performance Metrics</div>
        <div>Renders: {metrics.componentRenders}</div>
        <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)} MB</div>
        <div>Render Time: {metrics.renderTime.toFixed(2)} ms</div>
        <div>Last Update: {new Date(metrics.lastUpdate).toLocaleTimeString()}</div>
        <button
          onClick={() => PerformanceOptimizer.analyzeBundleSize()}
          className="mt-2 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
        >
          Analyze Bundle
        </button>
      </div>
    );
  };

  // Code splitting routes
  static createRoute = (path, componentImport) => ({
    path,
    component: PerformanceOptimizer.createLazyComponent(componentImport),
    preload: () => componentImport()
  });

  // Preload critical resources
  static preloadResources = (resources) => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as || 'script';
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  };

  // Service Worker registration with caching strategies
  static registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        // Update available
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update available notification
              console.log('New version available! Please refresh.');
            }
          });
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };
}

export default PerformanceOptimizer;