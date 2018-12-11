import React from 'react'
import TextImage from '../dist/index.min.js'

export default class App extends React.Component {
  state = {
    text: '',
    size: 20,
    color: '#000000',
    img: '',
    btnLoading: false
  }

  componentDidMount() {
    this.ti = new TextImage({
      text: this.state.text,
      fontSize: this.state.size,
      color: this.state.color
    })
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value })
  }

  handleGenerateB = () => {
    const img = new Image()
    img.src = this.ti.toDataURL({
      text: this.state.text,
      fontSize: this.state.size,
      color: this.state.color
    })
    document.body.appendChild(img)
  }

  handleGenerateA = () => {
    this.ti
      .createURL({
        text: this.state.text,
        fontSize: this.state.size,
        color: this.state.color
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

  handleUpload = ({ target }) => {
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
            this.ti.setImage(reader.result).then(() => {
              this.setState({
                btnLoading: false
              })
            })
          }
        } else {
          this.ti.setImage().then(() => {
            this.setState({
              btnLoading: false
            })
          })
        }
      }
    )
  }

  render() {
    const { text, size, color, btnLoading } = this.state

    return (
      <div className="control">
        <div className="control-group">
          <span className="control-label">image content:</span>
          <div className="control-inner">
            <input
              type="text"
              value={text}
              onChange={ev => {
                this.handleChange('text', ev.target.value)
              }}
            />
          </div>
        </div>
        <div className="control-group">
          <span className="control-label"> font size:</span>
          <div className="control-inner">
            <input
              type="range"
              value={size}
              onChange={ev => {
                this.handleChange('size', ev.target.value)
              }}
            />
            <span>{size}</span>
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">color:</span>
          <div className="control-inner">
            <input
              type="color"
              value={color}
              onChange={ev => {
                this.handleChange('color', ev.target.value)
              }}
            />
            <span>{color}</span>
          </div>
        </div>
        <div className="control-group">
          <span className="control-label">background image:</span>
          <div className="control-inner">
            <input type="file" onChange={this.handleUpload} />
          </div>
        </div>
        <div className="control-group">
          <button disabled={btnLoading} onClick={this.handleGenerateA}>
            generrate(object url)
          </button>
          <button disabled={btnLoading} onClick={this.handleGenerateB}>
            generrate(data url)
          </button>
        </div>
      </div>
    )
  }
}
