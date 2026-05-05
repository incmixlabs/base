npm install @antv/g2 @antv/g2-extension-ava
## Basic React Implementation
You can use the Auto mark to let the extension decide the best chart type for your data.
```javascript
import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { Auto } from '@antv/g2-extension-ava';

const AvaChart = ({ data }) => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initialize Chart
    const chart = new Chart({
      container: containerRef.current,
      autoFit: true,
    });

    // 2. Use the 'Auto' mark from the extension
    chart.options({
      type: Auto,
      data: data,
    });

    chart.render();
    chartRef.current = chart;

    // 3. Cleanup on unmount
    return () => {
      chart.destroy();
    };
  }, [data]);

  return <div ref={containerRef} style={{ height: '400px' }} />;
};

export default AvaChart;
```

## Advanced: Customizing with extendIf you want to use the extension's capabilities via a string-based API (e.g., type: 'auto'), you can use the extend method.
```javascript
import { Runtime, extend } from "@antv/g2";
import { autolib } from "@antv/g2-extension-ava";

// Create a custom Chart class that includes AVA capabilities
const ExtendedChart = extend(Runtime, autolib);

// Use 'ExtendedChart' instead of the standard 'Chart'
const chart = new ExtendedChart({ container: 'container' });
chart.options({ type: 'auto', data }); 
```
### Why use this in React?Dynamic Data: React's state management works well with AVA's automatic charting; when your data changes, the extension can re-evaluate and potentially switch chart types if the new data structure warrants it.Less Boilerplate: You don't have to manually define interval(), line(), or encode() for every different dataset.If you're using Ant Design, you might also look into Ant Design Charts, which provides higher-level React components built on top of G2.Would you like an example of how to handle window resizing or loading states with this chart?

