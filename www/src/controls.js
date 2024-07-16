import { simulation } from './drake.js'

const ControlPanelTemplate = document.createElement('template')
ControlPanelTemplate.innerHTML = `
	<link href="./main.css" rel="stylesheet" type="text/css" />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" rel="stylesheet" />

  <button title="Speed Down" id="speed-down-button" class="main-button">
    <i class="fa-solid fa-backward fa-2x" id="speed-down-icon"></i>
  </button>
  <button title="Play" id="play-pause-button" class="main-button" style="width: 3em">
    <i class="fa-solid fa-play fa-2x" id="play-pause-icon"></i>
  </button>
  <button title="Speed Up" id="speed-up-button" class="main-button">
    <i class="fa-solid fa-forward fa-2x" id="speed-up-icon"></i>
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
    const button = this.shadowRoot.querySelector('#play-pause-button')
    if (loop) {
      icon.classList.remove('fa-play')
      icon.classList.add('fa-pause')
      button.title = 'Pause'
    } else {
      icon.classList.remove('fa-pause')
      icon.classList.add('fa-play')
      button.title = 'Play'
    }
  }
}

customElements.define('control-panel', ControlPanel)

const SPEED_FACTOR = 25 / 100

export class Controls {
  constructor({ world }) {
    this._controlPanel = document.querySelector('control-panel')
    this._world = world
    this.loop = false

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

    const backwardButton = this._controlPanel.shadowRoot
      .querySelector('#speed-down-button')
    backwardButton.addEventListener('click', () => this.speedDown())

    const playPauseButton = this._controlPanel.shadowRoot
      .querySelector('#play-pause-button')
    playPauseButton.addEventListener('click', () => this.playPauseToggle())

    const forwardButton = this._controlPanel.shadowRoot
      .querySelector('#speed-up-button')
    forwardButton.addEventListener('click', () => this.speedUp())
  }

  speedDown() {
    const { current, min } = simulation['speed']
    const newCurrent = Math.floor(current - current * SPEED_FACTOR)
    simulation['speed'].current = newCurrent < min ? min : newCurrent
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

  speedUp() {
    const { current, max } = simulation['speed']
    const newCurrent = Math.ceil(current + current * SPEED_FACTOR)
    simulation['speed'].current = newCurrent > max ? max : newCurrent
  }
}
