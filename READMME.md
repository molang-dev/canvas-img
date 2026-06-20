# canvas-img
Canvas draw image cross origin resource

## Demo
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>drawImageCORS demo</title>
</head>
<body>
    <canvas id="myCanvas" width="800" height="600"></canvas>
    
    <script src="canvas_img.js"></script>
    
    <script>
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
        // drawImageCORS (src, x, y)
        ctx.drawImageCORS('https://picsum.photos/400/300', 50, 50)
            .then(() => console.log('done'))
            .catch(err => console.error('error:', err));
        
        // drawImageCORS (src, x, y, width, height)
        ctx.drawImageCORS('https://picsum.photos/400/200', 500, 50, 200, 150)
            .then(() => console.log('done'));
        
        // drawImageCORS (src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImageCORS(
            'https://picsum.photos/400/400',
            50, 50, 200, 150,  // clip
            50, 300, 200, 150
        );
        
        async function loadMultiple() {
            try {
                await ctx.drawImageCORS('https://picsum.photos/200/200', 0, 0);
                await ctx.drawImageCORS('https://picsum.photos/200/200', 200, 0);
                await ctx.drawImageCORS('https://picsum.photos/200/200', 400, 0);
                console.log('all done');
            } catch (error) {
                console.error('load error:', error);
            }
        }
        
        loadMultiple();
    </script>
</body>
</html><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>drawImageCORS demo</title>
</head>
<body>
    <canvas id="myCanvas" width="800" height="600"></canvas>
    
    <script src="canvas_img.js"></script>
    
    <script>
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        
        // drawImageCORS (src, x, y)
        ctx.drawImageCORS('https://picsum.photos/400/300', 50, 50)
            .then(() => console.log('done'))
            .catch(err => console.error('error:', err));
        
        // drawImageCORS (src, x, y, width, height)
        ctx.drawImageCORS('https://picsum.photos/400/200', 500, 50, 200, 150)
            .then(() => console.log('done'));
        
        // drawImageCORS (src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImageCORS(
            'https://picsum.photos/400/400',
            50, 50, 200, 150,  // clip
            50, 300, 200, 150
        );
        
        async function loadMultiple() {
            try {
                await ctx.drawImageCORS('https://picsum.photos/200/200', 0, 0);
                await ctx.drawImageCORS('https://picsum.photos/200/200', 200, 0);
                await ctx.drawImageCORS('https://picsum.photos/200/200', 400, 0);
                console.log('all done');
            } catch (error) {
                console.error('load error:', error);
            }
        }
        
        loadMultiple();
    </script>
</body>
</html>
```