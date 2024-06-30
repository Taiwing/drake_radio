const ControlPanelTemplate = document.createElement('template')
ControlPanelTemplate.innerHTML = `
	<link href="./main.css" rel="stylesheet" type="text/css" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" rel="stylesheet" />

  <button title="" id="play-pause-button" class="main-button">
    <i class="fa-solid fa-play fa-2x" id="play-pause-icon"></i>
  </button>
`

class ControlPanel extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(ControlPanelTemplate.content.cloneNode(true))
  }

  updatePlayPauseButton(loop) {
    const icon = this.shadowRoot.querySelector('#play-pause-icon')
    if (loop) {
      icon.classList.remove('fa-play')
      icon.classList.add('fa-pause')
    } else {
      icon.classList.remove('fa-pause')
      icon.classList.add('fa-play')
    }
  }
}

customElements.define('control-panel', ControlPanel)

export class Controls {
  constructor({ world }) {
    this._controlPanel = document.querySelector('control-panel')
    this._world = world
    this.loop = false

    const playPauseButton = this._controlPanel.shadowRoot
      .querySelector('#play-pause-button')
    playPauseButton.addEventListener('click', () => this.playPauseToggle())

    window.addEventListener('keydown', (key) => {
      switch (key.code) {
        case "Space":
          this.playPauseToggle()
          break
        default:
          return
      }
      key.preventDefault()
    })
  }

  playPauseToggle() {
    if (this.loop) {
      this._world.stop()
    } else {
      this._world.start()
    }
    this.loop = !this.loop

    this._controlPanel.updatePlayPauseButton(this.loop)
  }
}
