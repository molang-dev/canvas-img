# canvas-img

Cross-origin image drawing library for Canvas. Patches `CanvasRenderingContext2D` with a `drawImageCORS` method that mirrors the native `drawImage` API — same 3/5/9 argument signatures, same behavior, but works with cross-origin images.

## Build

```
npm run build
```

## Usage

```ts
import 'canvas-img'

const ctx = canvas.getContext('2d')
ctx.drawImageCORS(url, x, y)                              // simple
ctx.drawImageCORS(url, x, y, width, height)                // scaled
ctx.drawImageCORS(url, sx, sy, sw, sh, dx, dy, dw, dh)     // cropped
```

## CommonJS

```js
require('canvas-img')

ctx.drawImageCORS('https://example.com/image.png', 0, 0)
```

## Vanilla HTML

```html
<script type="module">
import 'canvas-img'

const ctx = canvas.getContext('2d')
ctx.drawImageCORS('https://example.com/image.png', 0, 0)
</script>
```

## React

```jsx
import { useRef, useEffect } from 'react'
import 'canvas-img'

function App() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.drawImageCORS('https://example.com/image.png', 0, 0)
  }, [])

  return <canvas ref={canvasRef} width={800} height={600} />
}
```

## Vue

```js
<template>
  <canvas ref="canvasRef" width="800" height="600" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'canvas-img'

const canvasRef = ref(null)

onMounted(() => {
  const ctx = canvasRef.value.getContext('2d')
  ctx.drawImageCORS('https://example.com/image.png', 0, 0)
})
</script>
```

## Angular

```ts
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import 'canvas-img'

@Component({
  selector: 'app-canvas',
  standalone: true,
  template: '<canvas #canvas width="800" height="600"></canvas>',
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>

  ngAfterViewInit() {
    const ctx = this.canvasRef.nativeElement.getContext('2d')
    if (!ctx) return
    ctx.drawImageCORS('https://example.com/image.png', 0, 0)
  }
}
```

## API

### `drawImageCORS(src, ...args)`

Three signatures, matching the native [`CanvasRenderingContext2D.drawImage`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage):

| Signature | Args |
|-----------|------|
| simple | `src, dx, dy` |
| scaled | `src, dx, dy, dWidth, dHeight` |
| cropped | `src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight` |

- `src` — image URL (string). Cross-origin URLs are loaded with `crossOrigin = 'anonymous'`.
- Callback-based: the image loads asynchronously and draws when ready.
- Successful loads are cached for 5 minutes; failed URLs have a 5-minute error cooldown.
- Concurrent requests to the same URL share a single image load.

### `mountDrawImageCORS()`

Manually patches `CanvasRenderingContext2D.prototype.drawImageCORS`. Called automatically on `import 'canvas-img'`.

## License

MIT
