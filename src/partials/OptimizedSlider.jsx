import React, { useState, useCallback, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { debounce } from 'lodash-es';

// Optimized slider component that prevents unnecessary re-renders
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
  // Local state to update UI immediately while dragging
  const [localValue, setLocalValue] = useState(value);
  
  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Create debounced version of onChange with lodash-es
  const debouncedOnChange = useCallback(
    debounce((newValue) => {
      onChange(newValue);
    }, 100),
    [onChange]
  );
  
  // Handle slider changes
  const handleChange = useCallback((newValue) => {
    setLocalValue(newValue[0]);
    debouncedOnChange(newValue[0]);
  }, [debouncedOnChange]);

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
        className="py-2"
      />
    </div>
  );
});

OptimizedSlider.displayName = 'OptimizedSlider';

export default OptimizedSlider;