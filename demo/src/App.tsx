import React, { useState } from 'react'
import './App.css'
import Text2Image from '../../src'

const tx = new Text2Image()

const App = () => {
  const [text, setText] = useState('')
  const [size, setSize] = useState(20)
  const [weight, setWeight] = useState(500)
  const [color, setColor] = useState('#000000')
  const [loading, setLoading] = useState(false)

  tx.setDefaultOptions({
    text: text,
    fontSize: size + 'px',
    color: color
  })

  const handleBlob = () => {
    console.log(tx)
    tx.createURL({
      text: text,
      fontSize: size + 'px',
      color: color,
      fontWeight: weight,
      gradient: [[0, '#f12929'], [1, '#ff502f']]
    }).then(url => {
      const img = new Image()
      img.onload = () => {
        // tx.destroyURL(img.src)
      }
      img.src = url
      document.body.appendChild(img)
    })
  }

  const handleUpload = ({ target }) => {
    const file = target.files[0]

    setLoading(true)
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        Text2Image.createMask(reader.result as string).then(image => {
          tx.setMask(image)
          setLoading(false)
        })
      }
    } else {
      tx.setMask()
      setLoading(false)
    }
  }

  const handleBase64 = () => {
    console.log(weight)
    const img = new Image()
    img.src = tx.toDataURL({
      text: text,
      fontSize: size + 'px',
      color: color,
      fontWeight: weight
    })
    document.body.appendChild(img)
  }

  return (
    <div className="control">
      <div className="control-group">
        <span className="control-label">内容（image content）:</span>
        <div className="control-inner">
          <input
            type="text"
            value={text}
            onChange={({ target: { value } }) => {
              setText(value)
            }}
          />
        </div>
      </div>
      <div className="control-group">
        <span className="control-label">字体大小（font size）:</span>
        <div className="control-inner">
          <input
            type="range"
            value={size}
            onChange={({ target: { value } }) => {
              setSize(+value)
            }}
          />
          <span>{size}</span>
        </div>
      </div>
      <div className="control-group">
        <span className="control-label">字体粗细（font weight）:</span>
        <div className="control-inner">
          <input
            type="range"
            value={weight}
            min="100"
            max="900"
            onChange={({ target: { value } }) => {
              setWeight(+value)
            }}
          />
          <span>{weight}</span>
        </div>
      </div>
      <div className="control-group">
        <span className="control-label">字体颜色（color）:</span>
        <div className="control-inner">
          <input
            type="color"
            value={color}
            name="color"
            onChange={({ target: { value } }) => {
              setColor(value)
            }}
          />
          <span>{color}</span>
        </div>
      </div>
      <div className="control-group">
        <span className="control-label">水印图片（mask image）:</span>
        <div className="control-inner">
          <input type="file" onChange={handleUpload} />
        </div>
      </div>
      <div className="control-group">
        <button disabled={loading} onClick={handleBlob}>
          生成(object url)
        </button>
        <button disabled={loading} onClick={handleBase64}>
          生成(data url)
        </button>
      </div>
    </div>
  )
}

export default App
