# text2image

> convert text to image by canvas

## Installation

### Install with npm or Yarn

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
// set background image or not
await ti.setImage(imgUrl)

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
// set background image or not
await ti.setImage(imgUrl)

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

## Constructor Options

> default options

| key          | description          | default     | options         |
| ------------ | -------------------- | ----------- | --------------- |
| `text`       | image content        | `null`      | `String`        |
| `fontSize`   | font size            | `30`        | `Number|String` |
| `fontWeight` | font weight          | `normal`    | `Number|String` |
| `fontFamily` | font family          | `arial`     | `String`        |
| `color`      | font color           | `#000000`   | `String`        |
| `type`       | export image type    | `image/png` | `String`        |
| `quality`    | export image quality | `0.92`      | `Number`        |

```js
// use current options convert default options
ti.setDefaultOptions({
  // some options
})

// reset default options
ti.resetDefaultOptions()
```

## polyfill

> use for IE

```js
;(function() {
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function(callback, type, quality) {
        var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
          len = binStr.length,
          arr = new Uint8Array(len)

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i)
        }

        callback(new Blob([arr], { type: type || 'image/png' }))
      }
    })
  }
})()
```

## Browsers support

Modern browsers and IE10.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE10, Edge                                                                                                                                                                                                      | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                           |

## LICENSE

MIT
