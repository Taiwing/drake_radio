import { config } from './simulation/config.js'
import { Simulation } from './simulation/index.js'
import { galaxySpec } from './simulation/constants.js'

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
  <button title="Re-Center" id="re-center-button" class="main-button">
    <i class="fa-solid fa-arrows-to-circle fa-2x" id="re-center-icon"></i>
  </button>
  <button title="Hard Reset" id="hard-reset-button" class="main-button">
    <i class="fa-solid fa-arrow-rotate-left fa-2x" id="hard-reset-icon"></i>
  </button>
`

class ControlPanel extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(ControlPanelTemplate.content.cloneNode(true))
  }

  updatePlayPauseButton(on) {
    const icon = this.shadowRoot.querySelector('#play-pause-icon')
    const button = this.shadowRoot.querySelector('#play-pause-button')
    if (on) {
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
    this._statsPanel = document.querySelector('stats-panel')

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

    const speedDownButton = this._controlPanel.shadowRoot
      .querySelector('#speed-down-button')
    speedDownButton.addEventListener('click', () => this.speedDown())

    const playPauseButton = this._controlPanel.shadowRoot
      .querySelector('#play-pause-button')
    playPauseButton.addEventListener('click', () => this.playPauseToggle())

    const speedUpButton = this._controlPanel.shadowRoot
      .querySelector('#speed-up-button')
    speedUpButton.addEventListener('click', () => this.speedUp())

    const reCenterButton = this._controlPanel.shadowRoot
      .querySelector('#re-center-button')
    reCenterButton.addEventListener('click', () => this.reCenter())

    const hardResetButton = this._controlPanel.shadowRoot
      .querySelector('#hard-reset-button')
    hardResetButton.addEventListener('click', () => this.hardReset())
  }

  get on() {
    return this._world.on
  }

  speedDown() {
    const { current, min } = config['speed']
    const newCurrent = Math.floor(current - current * SPEED_FACTOR)
    config['speed'].current = newCurrent < min ? min : newCurrent
    this._statsPanel.tick()
  }

  playPauseToggle() {
    if (this.on) {
      this._world.stop()
    } else {
      this._world.start()
    }

    this._controlPanel.updatePlayPauseButton(this.on)
  }

  speedUp() {
    const { current, max } = config['speed']
    const newCurrent = Math.ceil(current + current * SPEED_FACTOR)
    config['speed'].current = newCurrent > max ? max : newCurrent
    this._statsPanel.tick()
  }

  reCenter() {
    this._world.resetCamera()
  }

  hardReset() {
    const simulation = new Simulation()
    if (this.on) this.playPauseToggle()
    this._statsPanel.setup({ simulation })
    this._world.reset({ simulation, galaxySpec })
    this._world.render()
  }
}
