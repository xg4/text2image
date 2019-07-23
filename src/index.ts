import { isObj } from './utils'

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
  alpha: 0.3
}

export default class Text2image {
  private static instance: Text2image

  public static create(options?: Partial<Options>) {
    if (!this.instance) {
      this.instance = new this(options)
    }
    this.instance.setDefaultOptions(options)
    return this.instance
  }

  public static createMask(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image()
      image.onload = () => {
        resolve(image)
      }
      image.onerror = reject
      image.src = url
    })
  }

  public get width() {
    return this.c.width
  }

  public get height() {
    return this.c.height
  }

  public get font() {
    return `${this.options.fontWeight} ${this.options.fontSize} ${
      this.options.fontFamily
    }`
  }

  private defaultOptions: Options

  private options: Options

  private mask: HTMLImageElement | null

  private c: HTMLCanvasElement

  private ctx: CanvasRenderingContext2D

  public constructor(options?: Partial<Options>) {
    this.c = document.createElement('canvas')
    this.ctx = this.c.getContext('2d') as CanvasRenderingContext2D

    this.mask = null

    this.defaultOptions = {
      ...defaultOptions
    }

    this.options = {
      ...defaultOptions
    }

    this.setDefaultOptions(options)
  }

  public setDefaultOptions(options?: Partial<Options>) {
    Object.assign(this.defaultOptions, options)
  }

  public resetDefaultOptions() {
    this.defaultOptions = { ...defaultOptions }
  }

  public setMask(image?: HTMLImageElement) {
    this.mask = image || null
  }

  public toDataURL(text: string | Partial<Options>) {
    this.options = {
      ...this.defaultOptions,
      ...this.parseOptions(text)
    }

    this.draw()

    return this.c.toDataURL(this.options.type, this.options.quality)
  }

  public createURL(text: string | Partial<Options>): Promise<string> {
    return new Promise(resolve => {
      this.options = {
        ...this.defaultOptions,
        ...this.parseOptions(text)
      }

      this.draw()

      this.c.toBlob(
        blob => {
          resolve(URL.createObjectURL(blob))
        },
        this.options.type,
        this.options.quality
      )
    })
  }

  public destroyURL(url: string) {
    return URL.revokeObjectURL(url)
  }

  private parseOptions(text: string | Partial<Options>) {
    return isObj<Partial<Options>>(text) ? text : { text }
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
      this.options.gradient.forEach(v => {
        gradient.addColorStop(...v)
      })
      this.ctx.fillStyle = gradient
    } else {
      this.ctx.fillStyle = this.options.color
    }

    this.ctx.font = this.font
    this.ctx.textBaseline = 'middle'
    this.ctx.translate(0, this.height / 2)
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
      height: +this.options.fontSize.toString().replace(/\D/g, '')
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
