import { useRef, useEffect } from 'react'
import 'canvas-img'

export default function App() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')

    ctx.drawImageCORS('https://picsum.photos/400/300', 50, 50)
    ctx.drawImageCORS('https://picsum.photos/400/200', 500, 50, 200, 150)
    ctx.drawImageCORS(
      'https://picsum.photos/400/400',
      50, 50, 200, 150,
      50, 300, 200, 150
    )
  }, [])

  return <canvas ref={canvasRef} width={800} height={600} />
}
