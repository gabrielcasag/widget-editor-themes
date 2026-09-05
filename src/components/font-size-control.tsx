import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MAX_FONT_SIZE, MIN_FONT_SIZE } from "@/utils/styles";

interface FontSizeControlProps {
  value: number;
  onChange: (fontSize: number) => void;
}

export function FontSizeControl({ value, onChange }: FontSizeControlProps) {
  return (
    <div className="mt-6">
      <Label htmlFor="font-size-decrease" className="block mb-3">
        Editor font size
      </Label>

      <div className="flex items-center gap-2">
        <Button
          id="font-size-decrease"
          type="button"
          variant="outline"
          size="icon"
          aria-label="Decrease font size"
          disabled={value <= MIN_FONT_SIZE}
          onClick={() => onChange(value - 1)}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span
          aria-live="polite"
          className="w-14 text-center text-sm tabular-nums"
        >
          {value}px
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Increase font size"
          disabled={value >= MAX_FONT_SIZE}
          onClick={() => onChange(value + 1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
