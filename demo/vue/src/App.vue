<template>
  <canvas ref="canvasRef" width="800" height="600"></canvas>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'canvas-img'

const canvasRef = ref(null)

onMounted(() => {
  const ctx = canvasRef.value.getContext('2d')

  ctx.drawImageCORS('https://picsum.photos/400/300', 50, 50)
  ctx.drawImageCORS('https://picsum.photos/400/200', 500, 50, 200, 150)
  ctx.drawImageCORS(
    'https://picsum.photos/400/400',
    50, 50, 200, 150,
    50, 300, 200, 150
  )
})
</script>
