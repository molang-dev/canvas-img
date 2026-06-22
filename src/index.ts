// Extend CanvasRenderingContext2D prototype
export function mountDrawImageCORS() {
  if (typeof CanvasRenderingContext2D === 'undefined') return
  if (!CanvasRenderingContext2D.prototype.drawImageCORS) {
    CanvasRenderingContext2D.prototype.drawImageCORS = drawImageCORS
  }

  setInterval(
    () => {
      clean()
    },
    1000 * 60 * 5
  )
}

mountDrawImageCORS()

// Declare global augmentation for TypeScript
declare global {
  interface CanvasRenderingContext2D {
    drawImageCORS(src: string, x: number, y: number): void

    drawImageCORS(src: string, x: number, y: number, width: number, height: number): void

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
    ): void
  }
}

const handlers = new Map<string, Array<(img: HTMLImageElement | null) => void>>()
const errors = new Map<string, number>()
const images = new Map<string, { img: HTMLImageElement; t: number }>()

function clean() {
  const now = Date.now()
  for (const [key, value] of errors) {
    if ((now - value) / 1000 / 60 > 5) {
      errors.delete(key)
    }
  }
  for (const [key, value] of images) {
    if ((now - value.t) / 1000 / 60 > 5) {
      value.img.remove // TODO:: 如果这时候正好在画呢？
      images.delete(key)
    }
  }
}

function loadImage(src: string, result: (img: HTMLImageElement | null) => void) {
  const handResult = (img: HTMLImageElement | null) => {
    result(img)
    const list = handlers.get(src)
    if (!list) return
    // list.forEach((cb) => cb(img));
    console.log('result for done')
    list.splice(0)
    handlers.delete(src)
  }

  if (images.has(src)) {
    const i = images.get(src)!
    i.t = Date.now()
    handResult(i.img)
    return
  }

  if (errors.has(src)) {
    const failTime = errors.get(src)
    const diffMin = (Date.now() - failTime!) / 1000 / 60
    if (diffMin < 5) {
      handResult(null)
      return
    } else {
      errors.delete(src)
    }
  }

  // has request
  if (handlers.has(src)) {
    const list = handlers.get(src)
    if (list) {
      const index = list.indexOf(result)
      if (index === -1) {
        list.push(result)
      }
    }
    // already requesting, just wait...
    return
  } else {
    handlers.set(src, [result])
  }

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = src
  if (img.complete && img.naturalWidth > 0) {
    handResult(img)
    // img.remove();
    return
  }

  const onLoad = () => {
    img.removeEventListener('load', onLoad)
    img.removeEventListener('error', onError)
    handResult(img)
    images.set(img.src, { img: img, t: Date.now() })
    // img.remove();
  }

  // 没有网络的时候，疯狂抖动
  const onError = () => {
    img.removeEventListener('load', onLoad)
    img.removeEventListener('error', onError)
    errors.set(src, Date.now())
    handResult(null)
    // img.remove();
  }

  img.addEventListener('load', onLoad)
  img.addEventListener('error', onError)
}

export type DrawParams =
  | { type: 'simple'; src: string; x: number; y: number }
  | { type: 'scaled'; src: string; x: number; y: number; width: number; height: number }
  | {
      type: 'cropped'
      src: string
      sx: number
      sy: number
      sWidth: number
      sHeight: number
      dx: number
      dy: number
      dWidth: number
      dHeight: number
    }

/**
 * Parse function arguments
 */
function parseArguments(args: any[]): DrawParams {
  if (args.length === 3) {
    return {
      type: 'simple',
      src: args[0],
      x: args[1],
      y: args[2]
    }
  } else if (args.length === 5) {
    return {
      type: 'scaled',
      src: args[0],
      x: args[1],
      y: args[2],
      width: args[3],
      height: args[4]
    }
  } else if (args.length === 9) {
    return {
      type: 'cropped',
      src: args[0],
      sx: args[1],
      sy: args[2],
      sWidth: args[3],
      sHeight: args[4],
      dx: args[5],
      dy: args[6],
      dWidth: args[7],
      dHeight: args[8]
    }
  } else {
    throw new Error(
      `Invalid number of arguments: expected 3, 5, or 9 arguments, but got ${args.length}`
    )
  }
}

/**
 * Check if context is valid
 */
function isCanvasValid(ctx: any): ctx is CanvasRenderingContext2D {
  return ctx instanceof CanvasRenderingContext2D
}

/**
 * Core drawImageCORS function
 */
function drawImageCORS(this: CanvasRenderingContext2D, ...args: any[]): void {
  const ctx = this

  if (!isCanvasValid(ctx)) {
    console.error('Invalid canvas context')
    return
  }

  let params
  try {
    params = parseArguments(args)
  } catch (e) {
    console.error(e)
    return
  }

  const { src } = params
  if (!src || typeof src !== 'string') {
    console.error('Invalid image address')
    return
  }

  loadImage(src, (img: HTMLImageElement | null) => {
    if (img == null) {
      return
    }

    if (!isCanvasValid(ctx)) {
      throw new Error('Canvas context is no longer valid')
    }

    switch (params.type) {
      case 'simple':
        ctx.drawImage(img, params.x, params.y)
        break
      case 'scaled':
        ctx.drawImage(img, params.x, params.y, params.width, params.height)
        break
      case 'cropped':
        ctx.drawImage(
          img,
          params.sx,
          params.sy,
          params.sWidth,
          params.sHeight,
          params.dx,
          params.dy,
          params.dWidth,
          params.dHeight
        )
        break
    }
  })

  return
}

export default drawImageCORS
