type Data = [x: number, y: number, value: number];

const DefaultRadius = 25;
const DefaultGradient = {
  0.4: "blue",
  0.6: "cyan",
  0.7: "lime",
  0.8: "yellow",
  1.0: "red",
} as const;

class SimpleHeat {
  canvas: HTMLCanvasElement;
  #ctx: CanvasRenderingContext2D;
  #max: number;
  #data: Data[];
  constructor(
    canvas = document.createElement("canvas"),
    width = 500,
    height = 500
  ) {
    this.canvas = canvas;
    // https://html.spec.whatwg.org/multipage/canvas.html#concept-canvas-will-read-frequently
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext#willreadfrequently
    this.#ctx = this.canvas.getContext("2d", { willReadFrequently: true })!;
    this.canvas.width = width;
    this.canvas.height = height;
    this.#max = 1;
    this.#data = [];
  }

  //#region data configuration
  data(data: Data[]): this {
    this.#data = data;
    return this;
  }

  max(max: number): this {
    this.#max = max;
    return this;
  }

  add(point: Data): this {
    this.#data.push(point);
    return this;
  }

  clear(): this {
    this.#data = [];
    return this;
  }
  //#endregion

  //#region rendering configuration
  #circle: HTMLCanvasElement | null = null;
  #r: number | null = null;
  radius(radius: number, blur = 15): this {
    const circle = (this.#circle = document.createElement("canvas"));
    const ctx = this.#circle.getContext("2d")!;
    const r2 = (this.#r = radius + blur);

    circle.width = circle.height = r2 * 2;

    ctx.shadowOffsetX = ctx.shadowOffsetY = r2 * 2;
    ctx.shadowBlur = blur;
    ctx.shadowColor = "black";

    ctx.beginPath();
    ctx.arc(-r2, -r2, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();

    return this;
  }

  #grad: Uint8ClampedArray | null = null;
  gradient(grad: Record<number, string>): this {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);

    canvas.width = 1;
    canvas.height = 256;

    for (let i in grad) {
      gradient.addColorStop(+i, grad[i]);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1, 256);

    this.#grad = ctx.getImageData(0, 0, 1, 256).data;

    return this;
  }

  resize(width?: number, height?: number): this {
    if (width) this.canvas.width = width;
    if (height) this.canvas.height = height;
    return this;
  }
  //#endregion

  #animationFrameId: number | null = null;
  draw(minOpacity = 0.05): void {
    if (this.#animationFrameId) cancelAnimationFrame(this.#animationFrameId);
    this.#animationFrameId = requestAnimationFrame(() => {
      if (!this.#circle) this.radius(DefaultRadius);
      if (!this.#grad) this.gradient(DefaultGradient);

      const ctx = this.#ctx;

      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // draw a grayscale heatmap by putting a blurred circle at each data point
      for (let i = 0, len = this.#data.length, p; i < len; i++) {
        p = this.#data[i];
        ctx.globalAlpha = Math.min(Math.max(p[2] / this.#max, minOpacity), 1);
        ctx.drawImage(this.#circle!, p[0] - this.#r!, p[1] - this.#r!);
      }

      // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
      const colored = ctx.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      this.#colorize(colored.data, this.#grad!);
      ctx.putImageData(colored, 0, 0);

      this.#animationFrameId = null;
    });
  }

  //#region helper methods
  #colorize(pixels: Uint8ClampedArray, gradient: Uint8ClampedArray) {
    for (let i = 0, len = pixels.length, j; i < len; i += 4) {
      j = pixels[i + 3] * 4; // get gradient color from opacity value

      if (j) {
        pixels[i] = gradient[j];
        pixels[i + 1] = gradient[j + 1];
        pixels[i + 2] = gradient[j + 2];
      }
    }
  }
  //#endregion
}

export { SimpleHeat };
