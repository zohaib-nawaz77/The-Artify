import React, { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const OptimizedSlider = React.memo(({
  label,
  value,
  onChange,
  min,
  max,
  step,
  formatValue = (val) => val.toFixed(1),
  unit = '',
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync external value only when the user is *not* dragging.
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = ([v]) => setLocalValue(v);
  const handleCommit = ([v]) => onChange(v);

  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Badge variant="outline">{formatValue(localValue)}{unit}</Badge>
      </div>
      <Slider
        value={[localValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleChange}
        onValueCommit={handleCommit}
        className="py-2"
      />
    </div>
  );
});

OptimizedSlider.displayName = 'OptimizedSlider';
export default OptimizedSlider;