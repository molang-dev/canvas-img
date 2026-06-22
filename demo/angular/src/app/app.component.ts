import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core'
import 'canvas-img'

@Component({
  selector: 'app-root',
  standalone: true,
  template: '<canvas #canvas width="800" height="600"></canvas>',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>

  ngAfterViewInit() {
    const ctx = this.canvasRef.nativeElement.getContext('2d')
    if (!ctx) return

    ctx.drawImageCORS('https://picsum.photos/400/300', 50, 50)
    ctx.drawImageCORS('https://picsum.photos/400/200', 500, 50, 200, 150)
    ctx.drawImageCORS(
      'https://picsum.photos/400/400',
      50, 50, 200, 150,
      50, 300, 200, 150
    )
  }
}
