# text2image

[![npm](https://img.shields.io/npm/v/@xg4/text2image.svg)](https://www.npmjs.com/package/@xg4/text2image)
[![npm](https://img.shields.io/npm/l/@xg4/text2image.svg)](https://www.npmjs.com/package/@xg4/text2image)

> convert text to image by canvas

## Installation

### Install with npm or Yarn

```sh
# npm
npm i @xg4/text2image

# yarn
yarn add @xg4/text2image

# pnpm
pnpm i @xg4/text2image
```

## Usage

### Instance

```js
import text2image, { Text2Image } from '@xg4/text2image'

// use current options convert default options
text2image.setDefaultOptions({
  // some options
})

// reset default options
text2image.resetDefaultOptions()

// you can create new instance or use text2image singleton
const t2 = new Text2Image()
// or
// initialization default options
const t2 = new Text2Image({
  fontSize: 13,
  color: '#000000',
  fontFamily: 'arial',
  fontWeight: 'bold',
  type: 'image/png',
  quality: 0.92,
})

// use current options convert default options
t2.setDefaultOptions({
  // some options
})

// reset default options
t2.resetDefaultOptions()
```

## Object URL

### js/html

```js
async function renderTextImage() {
  const url = await text2image.createURL('hello world')
  const img = new Image()
  img.src = url
  document.body.appendChild(img)
}

renderTextImage()
```

### React

```tsx
import { useEffect, useState } from 'react'
import text2image from '../../../src'

export default function App() {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    async function renderTextImage() {
      const url = await text2image.createURL('Hello World')
      setImages((urls) => [...urls, url])
    }

    renderTextImage()
  }, [])

  return (
    <div>
      {images.map((url, index) => (
        <img
          src={url}
          key={index}
          onLoad={() => {
            // img loaded, should to destroy object url
            text2image.destroyURL(url)
          }}
        />
      ))}
    </div>
  )
}
```

### mask image

```js
async function renderTextImage() {
  // get mask image
  await text2image.loadImage(imgUrl)

  // create object url
  const url = await text2image.createURL('hello world')
  // or
  // const url = await text2image.createURL({
  //   text: 'hello world',
  //   // some options
  // })

  const img = new Image()
  // img loaded, should to destroy object url
  img.onload = () => {
    text2image.destroyURL(url)
  }
  img.src = url

  document.body.appendChild(img)
}

renderTextImage()
```

## DataURL

### js/html

```js
const url = text2image.toDataURL('hello world')
const img = new Image()
img.src = url
document.body.appendChild(img)
```

### React

```tsx
import { useEffect, useState } from 'react'
import text2image from '../../../src'

export default function App() {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    const url = text2image.toDataURL('Hello World')
    // const url = text2image.toDataURL({
    //   text: 'hello world',
    //   // some options
    // })
    setImages((urls) => [...urls, url])
  }, [])

  return (
    <div>
      {images.map((url, index) => (
        <img src={url} key={index} />
      ))}
    </div>
  )
}
```

### mask image

```js
async function getTextImage() {
  // get mask image
  await text2image.loadImage(imgUrl)

  // create data url
  const url = text2image.toDataURL('hello world')
  // or
  // const url = text2image.toDataURL({
  //   text: 'hello world',
  //   // some options
  // })

  const img = new Image()
  img.src = url

  document.body.appendChild(img)
}

getTextImage()
```

## Options

| name         | type             | default     | description                  |
| ------------ | ---------------- | ----------- | ---------------------------- |
| `text`       | `string`         | `null`      | image content                |
| `fontSize`   | `number\|string` | `30`        | font size(like css)          |
| `fontWeight` | `number\|string` | `normal`    | font weight(like css)        |
| `fontFamily` | `string`         | `arial`     | font family(like css)        |
| `color`      | `string`         | `#000000`   | font color(like css)         |
| `type`       | `string`         | `image/png` | image type                   |
| `quality`    | `number`         | `0.92`      | image quality                |
| `alpha`      | `number`         | `0.3`       | mask alpha(水印图片的透明度) |

## Example

> [https://text-image.vercel.app/](https://text-image.vercel.app/)

## Contributing

Welcome

- Fork it

- Submit pull request

## Polyfills needed to support older browsers

> `HTMLCanvasElement.prototype.toBlob`: see [MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob#Polyfill) for details about unsupported older browsers and a simple polyfill.

```js
;(function () {
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function (callback, type, quality) {
        var binStr = atob(this.toDataURL(type, quality).split(',')[1]),
          len = binStr.length,
          arr = new Uint8Array(len)

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i)
        }

        callback(new Blob([arr], { type: type || 'image/png' }))
      },
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
