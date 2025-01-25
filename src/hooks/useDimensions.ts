// Import required hooks from React
import { useEffect, useState } from "react";

/**
 * Custom hook to track dimensions (width and height) of a DOM element
 * @param containerRef - React ref object pointing to the HTML element to measure
 * @returns Current dimensions {width, height} of the referenced element
 */

export function useDimensions(containerRef: React.RefObject<HTMLElement>) {
  // State to store the current dimensions
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Get the current element from the ref
    const currentRef = containerRef.current;

    // Helper function to get current dimensions of the element
    function getDimensions() {
      return {
        width: currentRef?.offsetWidth || 0,
        height: currentRef?.offsetHeight || 0,
      };
    }

    // Create a ResizeObserver to watch for size changes
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        // Update dimensions when size changes
        setDimensions(getDimensions());
      }
    });

    // If element exists, start observing and set initial dimensions
    if (currentRef) {
      resizeObserver.observe(currentRef);
      setDimensions(getDimensions());
    }

    // Cleanup function to remove observers when component unmounts
    return () => {
      if (currentRef) {
        resizeObserver.unobserve(currentRef);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef]); // Re-run effect if containerRef changes

  return dimensions;
}
