interface Options {
  fontSize: number | string
  color: string
  fontFamily: string
  fontWeight: string | number
  type: string
  quality: number
  text: string
  gradient?: [number, string][]
  alpha: number
}

const defaultOptions: Options = {
  fontSize: '30px',
  color: '#000000',
  fontFamily: 'Arial',
  fontWeight: 'normal',
  type: 'image/png',
  quality: 0.92,
  text: '',
  alpha: 0.3,
}

export default class Text2Image {
  get width() {
    return this.c.width
  }

  get height() {
    return this.c.height
  }

  get font() {
    return `${this.options.fontWeight} ${this.options.fontSize} ${this.options.fontFamily}`
  }

  private defaultOptions: Options

  private options: Options

  private mask: HTMLImageElement | null

  private c: HTMLCanvasElement

  private ctx: CanvasRenderingContext2D

  constructor(options?: Partial<Options>) {
    this.c = document.createElement('canvas')
    const ctx = this.c.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to create canvas context')
    }

    this.ctx = ctx

    this.mask = null

    this.defaultOptions = {
      ...defaultOptions,
    }

    this.options = {
      ...defaultOptions,
    }

    this.setDefaultOptions(options)
  }

  setDefaultOptions(options?: Partial<Options>) {
    Object.assign(this.defaultOptions, options)
  }

  resetDefaultOptions() {
    this.defaultOptions = { ...defaultOptions }
  }

  setMask(image?: HTMLImageElement) {
    this.mask = image || null
  }

  async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => {
        this.setMask(image)
        resolve(image)
      }
      image.onerror = reject
      image.src = url
    })
  }

  toDataURL(text: string | Partial<Options>) {
    this.options = {
      ...this.defaultOptions,
      ...this.parseOptions(text),
    }

    this.draw()

    return this.c.toDataURL(this.options.type, this.options.quality)
  }

  createURL(text: string | Partial<Options>): Promise<string> {
    return new Promise((resolve) => {
      this.options = {
        ...this.defaultOptions,
        ...this.parseOptions(text),
      }

      this.draw()

      this.c.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('Failed to create blob')
          }
          resolve(URL.createObjectURL(blob))
        },
        this.options.type,
        this.options.quality
      )
    })
  }

  destroyURL(url: string) {
    return URL.revokeObjectURL(url)
  }

  parseOptions(text: string | Partial<Options>): Partial<Options> {
    return typeof text === 'string' ? { text } : text
  }

  private drawMask() {
    if (!this.mask) {
      return
    }

    this.ctx.save()
    const { width: w, height: h } = this
    const { width: mw, height: mh } = this.mask

    const scale = h / mh
    const computedHeight = Math.min(h, mh)
    const computedWidth = mw * scale

    this.ctx.globalAlpha = this.options.alpha
    this.ctx.drawImage(
      this.mask,
      w / 2 - computedWidth / 2,
      h / 2 - computedHeight / 2,
      computedWidth,
      computedHeight
    )
    this.ctx.restore()
  }

  private drawText() {
    this.ctx.save()

    if (this.options.gradient) {
      const gradient = this.ctx.createLinearGradient(0, 0, this.width, 0)
      this.options.gradient.forEach((v) => {
        gradient.addColorStop(...v)
      })
      this.ctx.fillStyle = gradient
    } else {
      this.ctx.fillStyle = this.options.color
    }

    this.ctx.font = this.font
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'
    this.ctx.translate(this.width / 2, this.height / 2 + this.height * 0.08)
    this.ctx.fillText(this.options.text, 0, 0)
    this.ctx.restore()
  }

  // 计算文字的宽高
  private measureText() {
    this.ctx.save()
    this.ctx.font = this.font
    const width = this.ctx.measureText(this.options.text).width
    this.ctx.restore()
    return {
      width,
      height: +this.options.fontSize.toString().replace(/\D/g, ''),
    }
  }

  private draw() {
    const { width, height } = this.measureText()
    this.c.height = height
    this.c.width = width
    this.ctx.clearRect(0, 0, this.width, this.height)

    if (!this.width || !this.height) {
      throw new TypeError(
        `Invalid width or height, width:${this.width} height:${this.height}`
      )
    }

    // draw
    this.drawText()

    this.drawMask()
  }
}
