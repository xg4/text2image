import { Divider } from 'antd'
import omit from 'lodash/omit'
import text2image, { Text2Image } from '../../src'
import Control from './components/Control'

const t1 = new Text2Image()

function onSubmit(t: Text2Image, type?: number) {
  return async (options: any) => {
    console.log(options)

    if (options.imageUrl && options.imageUrl.length) {
      await t.loadImage(options.imageUrl[0].thumbUrl)
      options = omit(options, 'imageUrl')
    }

    options = {
      ...options,
      ...(options.fontSize ? { fontSize: options.fontSize + 'px' } : {}),
    }
    if (type) {
      const code = `await text2image.toDataURL(${JSON.stringify(
        options,
        null,
        2
      )})`
      const url = t.toDataURL(options)

      return {
        code,
        url,
      }
    }
    const code = `await text2image.createURL(${JSON.stringify(
      options,
      null,
      2
    )})`
    const url = await t.createURL(options)
    return {
      code,
      url,
    }
  }
}

export default function App() {
  return (
    <div className="bg-gray-200 min-h-screen py-10">
      <Control title="Object URL" onSubmit={onSubmit(t1)} />
      <Divider />
      <Control title="Data URL" onSubmit={onSubmit(text2image, 1)} />
    </div>
  )
}
