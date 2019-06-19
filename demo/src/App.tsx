import React from 'react'
import './App.css'
import Text2Image from '../../src'

export default class App extends React.Component {
  public ti: Text2Image

  public state = {
    text: '',
    size: 20,
    color: '#000000',
    img: '',
    btnLoading: false,
    weight: 500
  }

  public componentDidMount() {
    this.ti = new Text2Image({
      text: this.state.text,
      fontSize: this.state.size,
      color: this.state.color
    })
  }

  public handleChange = (key, value) => {
    this.setState({ [key]: value })
  }

  public handleInputChange = ({ target }) => {
    const { type, name } = target
    const value = type === 'checkbox' ? target.checked : target.value
    this.setState({
      [name]: value
    })
  }

  public handleGenerateB = () => {
    // tslint:disable-next-line
    console.log(this.state.weight)
    const img = new Image()
    img.src = this.ti.toDataURL({
      text: this.state.text,
      fontSize: this.state.size,
      color: this.state.color,
      fontWeight: this.state.weight
    })
    document.body.appendChild(img)
  }

  public handleGenerateA = () => {
    this.ti
      .createURL({
        text: this.state.text,
        fontSize: this.state.size,
        color: this.state.color,
        fontWeight: this.state.weight,
        gradient: [[0, '#f12929'], [1, '#ff502f']]
      })
      .then(url => {
        const img = new Image()
        img.onload = () => {
          // this.ti.destroyURL(img.src)
        }
        img.src = url
        document.body.appendChild(img)
      })
  }

  public handleUpload = ({ target }) => {
    const file = target.files[0]
    this.setState(
      {
        btnLoading: true
      },
      () => {
        if (file) {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            Text2Image.createMask(reader.result as string).then(image => {
              this.ti.setMask(image)
              this.setState({
                btnLoading: false
              })
            })
          }
        } else {
          this.ti.setMask()
        }
      }
    )
  }

  public render() {
    const { text, size, color, btnLoading, weight } = this.state

    return (
      <div className="control">
        <div className="control-group">
          <span className="control-label">内容（image content）:</span>
          <div className="control-inner">
            <input
              type="text"
              value={text}
              name="text"
              onChange={this.handleInputChange}
            />
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">字体大小（font size）:</span>
          <div className="control-inner">
            <input
              type="range"
              value={size}
              name="size"
              onChange={this.handleInputChange}
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
              name="weight"
              onChange={this.handleInputChange}
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
              onChange={this.handleInputChange}
            />
            <span>{color}</span>
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">水印图片（mask image）:</span>
          <div className="control-inner">
            <input type="file" onChange={this.handleUpload} />
          </div>
        </div>
        <div className="control-group">
          <button disabled={btnLoading} onClick={this.handleGenerateA}>
            生成(object url)
          </button>
          <button disabled={btnLoading} onClick={this.handleGenerateB}>
            生成(data url)
          </button>
        </div>
      </div>
    )
  }
}
