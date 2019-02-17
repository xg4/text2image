import { isObj, isSrc } from './utils'

interface IOptions {
  fontSize?: number
  color?: string
  fontFamily?: string
  fontWeight?: string | number
  type?: string
  quality?: number
  text?: string
  gradient?: Array<[number, string]>
}

interface IDefaultOptions {
  fontSize: number
  color: string
  fontFamily: string
  fontWeight: string | number
  type: string
  quality: number
  text: string
  gradient?: Array<[number, string]>
}

/**
 * @description convert text to image by canvas
 */
export default class TextImage {
  get width() {
    return this.c.width
  }
  set width(value) {
    this.c.width = value
  }

  get height() {
    return this.c.height
  }
  set height(value) {
    this.c.height = value
  }

  get font() {
    return `${this.options.fontWeight} ${this.options.fontSize}px ${
      this.options.fontFamily
    }`
  }

  public static create(...args: any[]) {
    if (!this.instance) {
      this.instance = new this(...args)
    }
    return this.instance
  }
  private static instance: TextImage

  public defaultOptions = {
    fontSize: 30,
    color: '#000000',
    fontFamily: 'Arial',
    fontWeight: 'normal',
    type: 'image/png',
    quality: 0.92,
    text: '',
  }

  public currentOptions = {
    ...this.defaultOptions,
  }

  public options: IDefaultOptions = {
    ...this.defaultOptions,
  }

  public image?: HTMLImageElement | null

  public c: HTMLCanvasElement

  public ctx: CanvasRenderingContext2D

  constructor(options: IOptions = {}) {
    this.c = document.createElement('canvas')
    this.ctx = this.c.getContext('2d') as CanvasRenderingContext2D

    this.setDefaultOptions(options)
  }

  public setDefaultOptions(options: IOptions = {}) {
    Object.assign(this.currentOptions, options)
  }

  public resetDefaultOptions() {
    this.currentOptions = { ...this.defaultOptions }
  }

  public setImage(imgUrl?: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      if (!imgUrl || !isSrc(imgUrl)) {
        this.image = null
        resolve()
        return
      }

      if (this.image && this.image.src === imgUrl) {
        resolve()
        return
      }

      this.image = null

      const img = new Image()
      img.onload = () => {
        this.image = img
        resolve(img)
      }
      img.onerror = reject
      img.src = imgUrl
    })
  }

  public toDataURL(text: string | IOptions) {
    this.options = {
      ...this.currentOptions,
      ...this.parseOptions(text),
    }

    this.draw()

    if (!(this.width && this.height)) {
      return
    }
    return this.c.toDataURL(this.options.type, this.options.quality)
  }

  public createURL(text: string | IOptions): Promise<string> {
    return new Promise((resolve) => {
      this.options = {
        ...this.currentOptions,
        ...this.parseOptions(text),
      }

      this.draw()

      if (!(this.width && this.height)) {
        return
      }
      this.c.toBlob(
        (blob) => {
          resolve(URL.createObjectURL(blob))
        },
        this.options.type,
        this.options.quality,
      )
    })
  }

  public destroyURL(url: string) {
    return URL.revokeObjectURL(url)
  }

  private parseOptions(text: string | IOptions): IOptions {
    return isObj(text) ? (text as IOptions) : ({ text } as IOptions)
  }

  private drawImage() {
    if (!this.image) {
      return
    }

    this.ctx.save()
    const width = this.image.width
    const height = this.image.height
    this.ctx.drawImage(
      this.image,
      this.width / 2 - width / 2,
      this.height / 2 - height / 2,
      width,
      height,
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
    this.ctx.textBaseline = 'middle'
    this.ctx.translate(0, this.height / 2)
    this.ctx.fillText(this.options.text, 0, 0)
    this.ctx.restore()
  }

  private getTextWidth() {
    this.ctx.save()
    this.ctx.font = this.font
    const width = this.ctx.measureText(this.options.text).width
    this.ctx.restore()
    return width
  }

  private draw() {
    // clear
    this.ctx.clearRect(0, 0, this.width, this.height)

    // computed image width/height
    this.height = this.options.fontSize
    this.width = this.getTextWidth()

    // draw
    this.drawImage()
    this.drawText()
  }
}
