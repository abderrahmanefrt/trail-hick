import React from 'react';
import { T } from '@/data/texts';
import { clampByte } from '@/core/grid';

interface StepCalculatorProps {
  /** 9 neighbour pixel altitudes in row-major order. */
  pixels: readonly number[];
  /** 9 kernel coefficients in row-major order. */
  coefficients: readonly number[];
  divisor: number;
  offset?: number;
}

const COMPASS_DIRECTIONS = [
  'NO ↖',
  'N ↑',
  'NE ↗',
  'O ←',
  'Centre •',
  'E →',
  'SO ↙',
  'S ↓',
  'SE ↘',
];

/**
 * StepCalculator renders the transparent arithmetic of a 3×3 convolution:
 * 9 dot products, sum, division, offset, and final [0, 255] byte clamping.
 */
export default function StepCalculator({
  pixels,
  coefficients,
  divisor,
  offset = 0,
}: StepCalculatorProps): React.JSX.Element {
  const products = pixels.map((p, i) => p * (coefficients[i] ?? 0));
  const sum = products.reduce((acc, curr) => acc + curr, 0);
  const rawDivided = sum / divisor;
  const withOffset = rawDivided + offset;
  const clamped = clampByte(withOffset);

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
        {T.calculator.title}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs text-center font-mono">
          <thead>
            <tr className="bg-stone-100 text-stone-700">
              <th className="p-1.5 border border-stone-200">{T.calculator.direction}</th>
              <th className="p-1.5 border border-stone-200">{T.calculator.pixel}</th>
              <th className="p-1.5 border border-stone-200 font-sans">×</th>
              <th className="p-1.5 border border-stone-200">{T.calculator.coeff}</th>
              <th className="p-1.5 border border-stone-200 font-sans">=</th>
              <th className="p-1.5 border border-stone-200">{T.calculator.product}</th>
            </tr>
          </thead>
          <tbody>
            {pixels.map((val, idx) => {
              const coeff = coefficients[idx] ?? 0;
              const prod = products[idx] ?? 0;
              const isCenter = idx === 4;

              return (
                <tr
                  key={idx}
                  className={
                    isCenter
                      ? 'bg-orange-50/70 font-semibold text-orange-950'
                      : 'hover:bg-stone-50'
                  }
                >
                  <td className="p-1 border border-stone-200 text-stone-500">
                    {COMPASS_DIRECTIONS[idx]}
                  </td>
                  <td className="p-1 border border-stone-200">{val}</td>
                  <td className="p-1 border border-stone-200 text-stone-400">×</td>
                  <td className="p-1 border border-stone-200">{coeff}</td>
                  <td className="p-1 border border-stone-200 text-stone-400">=</td>
                  <td className="p-1 border border-stone-200 font-bold">{prod}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3.5 space-y-1.5 rounded-lg bg-stone-50 p-3 font-mono text-xs border border-stone-200">
        <div className="flex justify-between items-center">
          <span className="text-stone-600">{T.calculator.sum} :</span>
          <span className="font-bold text-stone-900">{sum}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-stone-600">
            {T.calculator.divided} ({divisor}) :
          </span>
          <span className="font-bold text-stone-900">{rawDivided.toFixed(2)}</span>
        </div>
        {offset !== 0 && (
          <div className="flex justify-between items-center">
            <span className="text-stone-600">
              {T.calculator.offset} ({offset}) :
            </span>
            <span className="font-bold text-stone-900">{withOffset.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-2 border-t border-stone-200 text-sm">
          <span className="font-sans font-bold text-stone-700">
            {T.calculator.clamped} :
          </span>
          <span className="font-bold text-base text-orange-600">{clamped}</span>
        </div>
      </div>
    </div>
  );
}
