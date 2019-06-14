import React from 'react'
import './App.css'
import TextImage from '../../src'

export default class App extends React.Component {
  public ti: TextImage

  public state = {
    text: '',
    size: 20,
    color: '#000000',
    img: '',
    btnLoading: false,
    weight: 500
  }

  public componentDidMount() {
    this.ti = new TextImage({
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
            this.ti.setImage(reader.result as string).then(() => {
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

  public render() {
    const { text, size, color, btnLoading, weight } = this.state

    return (
      <div className="control">
        <div className="control-group">
          <span className="control-label">image content:</span>
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
          <span className="control-label"> font size:</span>
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
          <span className="control-label">weight:</span>
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
          <span className="control-label">color:</span>
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
