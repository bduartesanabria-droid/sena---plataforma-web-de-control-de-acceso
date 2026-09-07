import React, { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface Barcode128Props {
  value: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
  text?: string;
  className?: string;
  fontSize?: number;
  lineColor?: string;
}

export const Barcode128: React.FC<Barcode128Props> = ({
  value,
  width = 1.8,
  height = 58,
  displayValue = true,
  text,
  className = '',
  fontSize = 13,
  lineColor = '#111827'
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && value) {
      try {
        JsBarcode(svgRef.current, value, {
          format: 'CODE128',
          width,
          height,
          displayValue,
          text: text || value,
          font: 'monospace',
          textAlign: 'center',
          textPosition: 'bottom',
          textMargin: 4,
          fontSize,
          background: 'transparent',
          lineColor,
          margin: 4
        });
      } catch (err) {
        console.warn('Barcode generation fallback:', err);
      }
    }
  }, [value, width, height, displayValue, text, fontSize, lineColor]);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg ref={svgRef} className="max-w-full overflow-visible" />
    </div>
  );
};
