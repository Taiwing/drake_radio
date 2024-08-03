import { config } from './simulation/config.js'
import { formatNumber } from './utils.js'
import { Civilization } from './simulation/index.js'

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

  <modal-button data-time="3000">
    <div slot="button" class="stats-panel-row">
      <div class="stats-panel-label">Year:</div>
      <div class="stats-panel-value" id="year-value"></div>
    </div>
    <div slot="modal">
      <p>
        Current simulation year.
      </p>
    </div>
  </modal-button>
  <modal-button data-time="3000">
    <div slot="button" class="stats-panel-row">
      <div class="stats-panel-label">Speed:</div>
      <div class="stats-panel-value" id="speed-value"></div>
    </div>
    <div slot="modal">
      <p>
        Simulation speed in year(s) per second.
      </p>
    </div>
  </modal-button>
  <modal-button data-time="3000">
    <div slot="button" class="stats-panel-row">
      <div class="stats-panel-label">Living:</div>
      <div class="stats-panel-value" id="living-value"></div>
    </div>
    <div slot="modal">
      <p>
        Number of civilizations currently emitting signals.
      </p>
    </div>
  </modal-button>
  <modal-button data-time="3000">
    <div slot="button" class="stats-panel-row">
      <div class="stats-panel-label">Dead:</div>
      <div class="stats-panel-value" id="dead-value"></div>
    </div>
    <div slot="modal">
      <p>
        Number of civilizations that have stopped emitting but whose signals can
        still be detected inside the galaxy.
      </p>
    </div>
  </modal-button>
  <modal-button data-time="5000">
    <div slot="button" class="stats-panel-row">
      <div class="stats-panel-label">Gone:</div>
      <div class="stats-panel-value" id="gone-value"></div>
    </div>
    <div slot="modal">
      <p>
        Number of dead civilizations whose signals have completely exited the
        galaxy. They cannot be detected anymore.
      </p>
    </div>
  </modal-button>
  <modal-button data-time="3000">
    <div slot="button" class="stats-panel-row">
      <div class="stats-panel-label">Total:</div>
      <div class="stats-panel-value" id="total-value"></div>
    </div>
    <div slot="modal">
      <p>
        Total civilization count.
      </p>
    </div>
  </modal-button>
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
      value: formatNumber(Math.floor(this._simulation.time)),
    })
    this.setValue({
      name: 'speed',
      value: formatNumber(config['speed']),
    })
    this.setValue({
      name: 'living',
      value: formatNumber(this._simulation.living.length),
    })
    this.setValue({
      name: 'dead',
      value: formatNumber(this._simulation.dead.length),
    })
    this.setValue({
      name: 'gone',
      value: formatNumber(this._simulation.gone.length),
    })
    this.setValue({
      name: 'total',
      value: formatNumber(Civilization.count),
    })
  }
}

customElements.define('stats-panel', StatsPanel)
