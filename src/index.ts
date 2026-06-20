// src/index.ts
import drawImageCORS from './drawImageCORS';

// Extend CanvasRenderingContext2D prototype
if (typeof CanvasRenderingContext2D !== 'undefined') {
  CanvasRenderingContext2D.prototype.drawImageCORS = drawImageCORS;
} else if (typeof HTMLCanvasElement !== 'undefined') {
  (HTMLCanvasElement.prototype as any).drawImageCORS = drawImageCORS;
}

// Export types
// export * from './types';

// Declare global augmentation for TypeScript
declare global {
  interface CanvasRenderingContext2D {
    drawImageCORS(
      src: string,
      x: number,
      y: number
    ): Promise<HTMLImageElement>;

    drawImageCORS(
      src: string,
      x: number,
      y: number,
      width: number,
      height: number
    ): Promise<HTMLImageElement>;

    drawImageCORS(
      src: string,
      sx: number,
      sy: number,
      sWidth: number,
      sHeight: number,
      dx: number,
      dy: number,
      dWidth: number,
      dHeight: number
    ): Promise<HTMLImageElement>;
  }
}