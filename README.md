# text2image

> convert text to image by canvas

## Installation

Install with npm or Yarn.

```bash
# npm
$ npm install @xg4/text2image --save
```

```bash
#yarn
$ yarn add @xg4/text2image
```

## Usage

```js
import TextImage from '@xg4/text2image'
const ti = new TextImage()
// or
// initialization default options
const ti = new TextImage({
  fontSize: 13,
  color: '#000000',
  fontFamily: 'arial',
  fontWeight: 'bold',
  type: 'image/png',
  quality: 0.92
})
```

```js
// create object url
const url = ti.createURL('hello world')
// or
const url = ti.createURL({
  text: 'hello world'
  // some options
})

const img = new Image()
// img loaded, remenber to destroy object url
img.onload = function() {
  ti.destroyURL(this.src)
}
img.src = url
document.body.appendChild(img)
```

```js
// create data url
const url = ti.toDataURL('hello world')
// or
const url = ti.toDataURL({
  text: 'hello world'
  // some options
})

const img = new Image()
img.src = url
document.body.appendChild(img)
```

## API

| 参数                | 说明             | 类型     | arguments     | return      |
| ------------------- | ---------------- | -------- | ------------- | ----------- |
| toDataURL           | 导出 data:base64 | function | string/option | data:base64 |
| createURL           | 导出 object URL  | function | string/option | object URL  |
| destroyURL          | 销毁 object URL  | function | object URL    | void        |
| setDefaultOptions   | 设置默认选项     | function | option        | void        |
| resetDefaultOptions | 重置默认选项     | function | 无            | void        |
| setImage            | 设置背景图片     | function | image url     | Promise     |

```ts
interface options {
  text: string // 文本内容
  fontSize: number | string // 字体大小
  color: string // 字体颜色
  fontFamily: string // 字体样式
  fontWeight: string | number // 字体粗细
  type: string // 导出图片类型
  quality: number | string // 导出图片质量
}

defaultOptions = {
  fontSize: 30,
  color: '#000000',
  fontFamily: 'arial',
  fontWeight: 'normal',
  type: 'image/png',
  quality: 0.92
}
```

## Browsers support

Modern browsers and IE10.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE10, Edge                                                                                                                                                                                                      | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                           |

## LICENSE

MIT
