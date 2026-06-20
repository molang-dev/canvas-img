/**
 * canvas.drawImageCORS - Cross-origin image drawing library
 * Loads images by dynamically creating hidden <img> elements, then draws them to canvas after loading completes
 *
 * Usage:
 *   canvas.drawImageCORS(src, x, y)
 *   canvas.drawImageCORS(src, x, y, width, height)
 *   canvas.drawImageCORS(src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
 *
 * Returns: Promise that resolves when the image is loaded and drawn
 */

(function () {
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      // const img = createHiddenImg(src);
      const img = new Image()

      const onLoad = function () {
        // console.log('loaded')

        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
        resolve(img);
      };

      const onError = function () {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);

        if (img.parentNode) {
          img.parentNode.removeChild(img);
        }
        reject("Load image error " + src);
      };



      img.src = src;

      // If the image is already cached (browser cache), complete may be true
      if (img.complete) {
        // console.log('cached')
        // But onload may or may not have been triggered, handle it manually
        if (img.naturalWidth > 0) {
          // Manually trigger the load event
          const loadEvent = new Event("load");
          img.dispatchEvent(loadEvent);
        } else {
          // Manually trigger the error event
          const errorEvent = new Event("error");
          img.dispatchEvent(errorEvent);
        }
        resolve(img);
      }else{
        img.addEventListener("load", onLoad);
        img.addEventListener("error", onError);
      }
    });
  }

  function parseArguments(args) {
    if (args.length === 3) {
      // drawImageCORS(src, x, y)
      return {
        type: "simple",
        src: args[0],
        x: args[1],
        y: args[2],
      };
    } else if (args.length === 5) {
      // drawImageCORS(src, x, y, width, height)
      return {
        type: "scaled",
        src: args[0],
        x: args[1],
        y: args[2],
        width: args[3],
        height: args[4],
      };
    } else if (args.length === 9) {
      // drawImageCORS(src, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      return {
        type: "cropped",
        src: args[0],
        sx: args[1],
        sy: args[2],
        sWidth: args[3],
        sHeight: args[4],
        dx: args[5],
        dy: args[6],
        dWidth: args[7],
        dHeight: args[8],
      };
    } else {
      throw new Error("Invalid number of arguments: expected 3, 5, or 9 arguments, but got ${args.length}");
    }
  }

  function isCanvasValid(ctx) {
    return ctx instanceof CanvasRenderingContext2D;
  }

  function drawImageCORS(...args) {
    const ctx = this;

    if (!isCanvasValid(ctx)) {
      return Promise.reject(new Error("Invalid canvas"));
    }

    let params;
    try {
      params = parseArguments(args);
    } catch (e) {
      return Promise.reject(e);
    }

    const src = params.src;
    if (!src || typeof src !== "string") {
      return Promise.reject(new Error("Invalid image address"));
    }

    return loadImage(src)
      .then((img) => {
        if (!isCanvasValid(ctx)) {
          throw new Error("Invalid canvas");
        }

        switch (params.type) {
          case "simple":
            ctx.drawImage(img, params.x, params.y);
            break;
          case "scaled":
            ctx.drawImage(img, params.x, params.y, params.width, params.height);
            break;
          case "cropped":
            ctx.drawImage(
              img,
              params.sx,
              params.sy,
              params.sWidth,
              params.sHeight,
              params.dx,
              params.dy,
              params.dWidth,
              params.dHeight,
            );
            break;
        }

        return img;
      })
      .catch((error) => {
        console.error("drawImageCORS faild:", error.message);
        throw error;
      });
  }

  if (typeof CanvasRenderingContext2D !== "undefined") {
    CanvasRenderingContext2D.prototype.drawImageCORS = drawImageCORS;
  } else {
    if (typeof HTMLCanvasElement !== "undefined") {
      HTMLCanvasElement.prototype.drawImageCORS = drawImageCORS;
    }
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      drawImageCORS,
    };
  } else if (typeof window !== "undefined") {
    window.drawImageCORS = drawImageCORS;
  }
})();
