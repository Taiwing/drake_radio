import { config } from './simulation/config.js'
import { formatNumber } from './utils.js'

const StatsPanelTemplate = document.createElement('template')
StatsPanelTemplate.innerHTML = `
	<link href="./main.css" rel="stylesheet" type="text/css" />

  <style>
    .stats-panel-row {
      display: flex;
      justify-content: space-between;
      gap: 1em;
      margin-bottom: 0.25em;
    }

    .stats-panel-label {
      font-weight: bold;
    }

    .stats-panel-value {
      text-align: right;
    }
  </style>

  <div class="stats-panel-row">
    <div class="stats-panel-label">Year:</div>
    <div class="stats-panel-value" id="year-value"></div>
  </div>
  <div class="stats-panel-row">
    <div class="stats-panel-label">Speed:</div>
    <div class="stats-panel-value" id="speed-value"></div>
  </div>
  <div class="stats-panel-row">
    <div class="stats-panel-label">Living:</div>
    <div class="stats-panel-value" id="living-value"></div>
  </div>
  <div class="stats-panel-row">
    <div class="stats-panel-label">Dead:</div>
    <div class="stats-panel-value" id="dead-value"></div>
  </div>
  <div class="stats-panel-row">
    <div class="stats-panel-label">Gone:</div>
    <div class="stats-panel-value" id="gone-value"></div>
  </div>
  <div class="stats-panel-row">
    <div class="stats-panel-label">Total:</div>
    <div class="stats-panel-value" id="total-value"></div>
  </div>
`

class StatsPanel extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(StatsPanelTemplate.content.cloneNode(true))
  }

  setup({ simulation }) {
    this._simulation = simulation
    const stats = this.shadowRoot.querySelectorAll(".stats-panel-value")
    for (const stat of stats) stat.textContent = 0
    this._simulation.onTick = () => this.tick()
    this.tick()
  }

  setValue({ name, value }) {
    const element = this.shadowRoot.querySelector(`#${name}-value`)
    element.textContent = value
  }

  tick() {
    this.setValue({
      name: 'year',
      value: formatNumber(Math.floor(this._simulation.time), 6, 4),
    })
    this.setValue({
      name: 'speed',
      value: formatNumber(config['speed'].current, 6, 4),
    })
    this.setValue({
      name: 'total',
      value: formatNumber(this._simulation.civilizations.length, 6, 4),
    })
  }
}

customElements.define('stats-panel', StatsPanel)
