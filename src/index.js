import './polyfill'
import { isObj, isSrc } from './utils/index'

/**
 * @description convert text to image by canvas
 */
export default class TextImage {
  static new(...args) {
    if (!this.instance) {
      this.instance = new this(...args)
    }
    return this.instance
  }

  static setDefaultOptions(options) {
    Object.assign(currentOptions, options)
  }

  static resetDefaultOptions() {
    this.currentOptions = { ...this.defaultOptions }
  }

  static defaultOptions = {
    fontSize: 30,
    color: '#000',
    fontFamily: 'arial',
    fontWeight: 'normal',
    type: 'image/png',
    quality: 0.92
  }

  static currentOptions = {
    ...TextImage.defaultOptions
  }

  constructor(options = {}) {
    this.c = document.createElement('canvas')
    this.ctx = this.c.getContext('2d')

    this.options = {
      ...TextImage.currentOptions,
      ...this._parseOptions(options)
    }
  }

  _parseOptions(text) {
    return isObj(text) ? text : { text }
  }

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

  _drawImage() {
    if (!this.image) return

    this.ctx.save()
    const width = this.image.width
    const height = this.image.height
    this.ctx.drawImage(
      this.image,
      this.width / 2 - width / 2,
      this.height / 2 - height / 2,
      width,
      height
    )
    this.ctx.restore()
  }

  _drawText() {
    this.ctx.save()
    this.ctx.fillStyle = this.options.color
    this.ctx.font = this.font
    this.ctx.textBaseline = 'hanging'
    this.ctx.fillText(this.options.text, 0, 0)
    this.ctx.restore()
  }

  _getTextWidth() {
    this.ctx.save()
    this.ctx.font = this.font
    const width = this.ctx.measureText(this.options.text).width
    this.ctx.restore()
    return width
  }

  _draw() {
    // clear
    this.ctx.clearRect(0, 0, this.width, this.height)

    // computed image width/height
    this.height = this.options.fontSize
    this.width = this._getTextWidth()

    // draw
    this._drawImage()
    this._drawText()
  }

  setImage(imgUrl) {
    return new Promise((resolve, reject) => {
      if (!isSrc(imgUrl)) {
        this.image = null
        this.imageUrl = null
        resolve()
        return
      }

      if (this.imageUrl === imgUrl) {
        resolve()
        return
      }

      const img = new Image()
      img.onload = () => {
        this.image = img
        this.imageUrl = imgUrl
        resolve(img)
      }
      img.onerror = reject
      img.src = imgUrl
    })
  }

  toDataURL(text) {
    Object.assign(this.options, this._parseOptions(text))

    this._draw()
    return this.c.toDataURL(this.options.type, this.options.quality)
  }

  createURL(text) {
    return new Promise(resolve => {
      Object.assign(this.options, this._parseOptions(text))

      this._draw()

      this.c.toBlob(
        blob => {
          resolve(URL.createObjectURL(blob))
        },
        this.options.type,
        this.options.quality
      )
    })
  }

  destroyURL(url) {
    if (/^blob:/.test(url)) {
      URL.revokeObjectURL(url)
    }
  }
}
