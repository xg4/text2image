import './polyfill'
import { isObj, isSrc } from './utils'

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
    fontFamily: 'Arial',
    fontWeight: 'bold'
  }

  static currentOptions = {
    ...this.defaultOptions
  }

  constructor(options = {}) {
    this.c = document.createElement('canvas')
    this.ctx = this.c.getContext('2d')

    this.options = {
      ...TextImage.currentOptions,
      ...this._parseOptions(options)
    }
  }

  _parseOptions(value) {
    return isObj(value) ? value : { value }
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
    this.ctx.fillStyle = this.color
    this.ctx.font = this.font
    this.ctx.textBaseline = 'hanging'
    this.ctx.fillText(this.options.value, 0, 0)
    this.ctx.restore()
  }

  _reset() {
    // clear
    this.ctx.clearRect(0, 0, this.width, this.height)

    // computed image width/height
    this.height = this.options.fontSize

    this.ctx.save()
    this.ctx.font = this.font
    this.width = this.ctx.measureText(this.options.value).width
    this.ctx.restore()

    this._drawImage()
  }

  setImage(imgUrl) {
    if (!imgUrl) {
      this.image = null
      this.imageUrl = null
      return
    }

    if (!isSrc(imgUrl)) {
      this.image = null
      this.imageUrl = null
      return
    }

    if (this.imageUrl === imgUrl) return

    return new Promise((resolve, reject) => {
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

  create(value, options = {}) {
    return new Promise((resolve, reject) => {
      Object.assign(this.options, options, this._parseOptions(value))

      this._reset()
      // draw
      this._drawText()

      // export
      this.c.toBlob(blob => {
        resolve(window.URL.createObjectURL(blob))
      }, 'image/png')
    })
  }

  destroy(url) {
    if (/^blob:/.test(url)) {
      window.URL.revokeObjectURL(url)
    }
  }
}
