import { CorpusFile } from "@/types/app.types";
import React, { useState, useEffect } from "react";

interface FolderProps {
  color?: string;
  size?: number;
  items?: CorpusFile[];
  className?: string;
  onItemClick?: (index: number) => void;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

const Folders: React.FC<FolderProps> = ({
  color = "#00a6f4",
  size = 1,
  items = [],
  className = "",
  onItemClick,
}) => {
  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    []
  );

  useEffect(() => {
    setPaperOffsets(
      Array.from({ length: items.length }, () => ({ x: 0, y: 0 }))
    );
  }, [items.length]);

  const folderBackColor = darkenColor(color, 0.08);

  const handleClick = () => {
    setOpen((prev) => !prev);
    if (open) {
      setPaperOffsets(
        Array.from({ length: items.length }, () => ({ x: 0, y: 0 }))
      );
    }
  };

  const handlePaperMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const scaleStyle = { transform: `scale(${size})` };

  const getOpenTransform = (index: number) => {
    const spread = 45 + index * 10;
    const direction = index % 2 == 0 ? -1.2 : 1.2;
    const angle = direction * (5 + index * 1.5);
    const x = direction * spread;
    const y = -45 - index * 25;
    return `translate(${x}%, ${y}%) rotate(${angle}deg)`;
  };
  return (
    <div style={scaleStyle} className={className}>
      <div
        className={`group relative transition-all duration-200 ease-in cursor-pointer ${
          !open ? "hover:-translate-y-2" : ""
        }`}
        style={{
          transform: open ? "translateY(-8px)" : undefined,
        }}
        onClick={() => {
          if (items.length > 0) {
            handleClick();
          }
        }}
      >
        <div
          className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px]"
            style={{ backgroundColor: folderBackColor }}
          ></span>

          {items.map((item, i) => {
            const sizePercentage = 70 + Math.min(i * 10, 20);
            const heightPercentage = 60 + Math.min(i * 10, 20);

            const transformStyle = open
              ? `translate(-50%, -10%) ${getOpenTransform(i)} translate(${
                  paperOffsets[i].x
                }px, ${paperOffsets[i].y}px)`
              : undefined;

            const paperShade = darkenColor("#f4f4f4", Math.min(0.02 * i, 0.2));

            return (
              <div
                key={i}
                onClick={() => onItemClick?.(i)}
                onMouseMove={(e) => handlePaperMouseMove(e, i)}
                onMouseLeave={(e) => handlePaperMouseLeave(e, i)}
                className={`absolute z-20 bottom-[10%] left-1/2 transition-all duration-300 ease-in-out ${
                  !open
                    ? "transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0"
                    : "hover:scale-110"
                }`}
                style={{
                  ...(open ? { transform: transformStyle } : {}),
                  width: `${sizePercentage}%`,
                  height: `${heightPercentage}%`,
                  backgroundColor: paperShade,
                  borderRadius: "10px",
                  cursor: "pointer",
                }}
              >
                <span className="flex items-center justify-center my-5">
                  {typeof item === "object" && "name" in item
                    ? item.name.split(".")[0].slice(0, 5)
                    : String(item)}
                </span>
              </div>
            );
          })}
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? "group-hover:[transform:skew(15deg)_scaleY(0.6)]" : ""
            }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && { transform: "skew(15deg) scaleY(0.6)" }),
            }}
          ></div>

          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? "group-hover:[transform:skew(-15deg)_scaleY(0.6)]" : ""
            }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && { transform: "skew(-15deg) scaleY(0.6)" }),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Folders;
