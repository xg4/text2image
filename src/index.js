/**
 * @description change text to image by canvas
 */
export default class XTextImage {
  static new(...args) {
    if (!this.instance) {
      this.instance = new this(...args)
    }
    return this.instance
  }

  constructor(options = {}) {
    this.c = document.createElement('canvas')
    this.ctx = this.c.getContext('2d')

    this._init(options)
  }

  _init({
    fontSize = 30,
    color = '#000',
    fontFamily = 'Arial',
    fontWeight = 'bold'
  }) {
    this.height = fontSize
    this.color = color
    this.fontFamily = fontFamily
    this.fontWeight = fontWeight
  }

  setMarkImage(imgUrl) {
    if (!imgUrl) {
      this.mark = null
      this.markUrl = null
      return
    }
    // 同一张图片不处理
    if (this.markUrl === imgUrl) return
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.markUrl = imgUrl
        this.mark = img
        resolve(img)
      }
      img.onerror = reject
      img.src = imgUrl
    })
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

  get fontStyle() {
    return `${this.height}px ${this.fontWeight} ${this.fontFamily}`
  }

  _drawMark() {
    if (!this.mark) {
      return
    }

    this.ctx.save()
    const width = this.mark.width
    const height = this.mark.height
    this.ctx.drawImage(
      this.mark,
      this.width / 2 - width / 2,
      this.height / 2 - height / 2,
      width,
      height
    )
    this.ctx.restore()
  }

  _drawText(text) {
    this.ctx.save()
    this.ctx.fillStyle = this.color
    this.ctx.font = this.fontStyle
    this.ctx.textBaseline = 'hanging'
    this.ctx.fillText(text, 0, 0)
    this.ctx.restore()
  }

  _reset(text) {
    // clear
    this.ctx.clearRect(0, 0, this.width, this.height)

    // computed image width
    this.ctx.save()
    this.ctx.font = this.fontStyle
    this.width = this.ctx.measureText(text).width
    this.ctx.restore()

    this._drawMark()
  }

  getImageUrl(text) {
    return new Promise((resolve, reject) => {
      this._reset(text)
      // draw
      this._drawText(text)

      // export
      this.c.toBlob(blob => {
        resolve(window.URL.createObjectURL(blob))
      }, 'image/png')
    })
  }

  destroy(imgUrl) {
    window.URL.revokeObjectURL(imgUrl)
  }
}
