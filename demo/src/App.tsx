import { Divider } from 'antd'
import text2image, { Text2Image } from '../../src'
import Control from './components/Control'

const t1 = new Text2Image()

export default function App() {
  return (
    <div className="bg-gray-200 min-h-screen py-10">
      <Control
        title="Object URL"
        onSubmit={async (options) => {
          console.log(options)

          if (options.imageUrl && options.imageUrl.length) {
            await t1.loadImage(options.imageUrl[0].thumbUrl)
          }

          return await t1.createURL({
            ...options,
            ...(options.fontSize ? { fontSize: options.fontSize + 'px' } : {}),
          })
        }}
      />

      <Divider />
      <Control
        title="Data URL"
        onSubmit={async (options) => {
          if (options.imageUrl) {
            await text2image.loadImage(options.imageUrl)
          }

          return text2image.toDataURL({
            ...options,
            ...(options.fontSize ? { fontSize: options.fontSize + 'px' } : {}),
          })
        }}
      />
    </div>
  )
}
