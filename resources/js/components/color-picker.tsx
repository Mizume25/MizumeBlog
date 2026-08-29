import { useState } from "react";

interface ColorPickerProps {
  defaultValue?: string;
  onChange?: (hex: string) => void;
  label?: string;
}

const HEX_PATTERN = /^#([0-9A-Fa-f]{6})$/;

export default function ColorPicker({
  defaultValue = "#5B8CFF",
  onChange,
  label = "Color",
}: ColorPickerProps) {
  const [color, setColor] = useState(defaultValue);
  const [hexDraft, setHexDraft] = useState(defaultValue);

  const commitColor = (hex: string) => {
    setColor(hex);
    setHexDraft(hex.toUpperCase());
    onChange?.(hex);
  };

  const handlePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    commitColor(e.target.value);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHexDraft(e.target.value);
  };

  const handleHexBlur = () => {
    let value = hexDraft.trim();
    if (!value.startsWith("#")) value = `#${value}`;

    if (HEX_PATTERN.test(value)) {
      commitColor(value);
    } else {
      // valor inválido: revierte al último color válido
      setHexDraft(color.toUpperCase());
    }
  };

  return (
    <div className="flex items-center gap-3 bg-[#171a21] border border-[#2a2f3a] rounded-xl px-4 py-2.5 w-fit mb-2">
      <div className="relative w-11 h-11 flex-none">
        <input
          type="color"
          value={color}
          onChange={handlePickerChange}
          aria-label="Elegir color"
          className="
            w-full h-full p-0 border-2 border-[#2a2f3a] rounded-[10px]
            cursor-pointer bg-transparent appearance-none
            [&::-webkit-color-swatch-wrapper]:p-0
            [&::-webkit-color-swatch]:rounded-[8px]
            [&::-webkit-color-swatch]:border-0
            hover:scale-105 transition-transform duration-150
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-[#5b8cff]
          "
        />
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="text-[11px] uppercase tracking-wider text-[#8a90a0]">
          {label}
        </span>
        <input
          type="text"
          value={hexDraft}
          onChange={handleHexChange}
          onBlur={handleHexBlur}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          maxLength={7}
          spellCheck={false}
          className="
            bg-transparent border-0 outline-none w-[90px]
            text-[15px] font-mono tabular-nums text-[#e8eaed]
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-2 focus-visible:outline-[#5b8cff]
            focus-visible:rounded-[3px]
          "
        />
      </div>
    </div>
  );
}