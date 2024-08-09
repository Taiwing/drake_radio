import { formatNumber, capitalize } from './utils.js'
import { config } from './simulation/config.js'
import { CustomDialog } from './custom-dialog.js'

const SettingsDialogHTML = `
<h3>Settings</h3>
<form id="drake-form" method="dialog">
	<fieldset class="fieldset-grid">
		<legend>Simulation</legend>

		<label class="grid-label" for="time">
			<modal-button>
				<span slot="button">Time</span>
				<div slot="modal">
					<p>Average time that a light shines (in years).</p>
				</div>
			</modal-button>
		</label>
		<input class="grid-field" type="text" inputmode="numeric" id="time" />

		<label class="grid-label" for="spawn-rate">
			<modal-button>
				<span slot="button">Spawn Rate</span>
				<div slot="modal">
					<p>Average rate light spawn (per year).</p>
				</div>
			</modal-button>
		</label>
		<input class="grid-field" type="text" inputmode="numeric" id="spawn-rate" />

		<label class="grid-label" for="speed">
			<modal-button>
				<span slot="button">Speed</span>
				<div slot="modal">
					<p>Simulation speed in year(s) per second.</p>
				</div>
			</modal-button>
		</label>
		<input class="grid-field" type="text" inputmode="numeric" id="speed" />
	</fieldset>

	<fieldset class="fieldset-grid">
		<legend>Result</legend>

		<label class="grid-label" for="N">
			<modal-button>
				<span slot="button">N:</span>
				<div slot="modal">
					<p>Average number of lights shining at any given time.</p>
				</div>
			</modal-button>
		</label>
	  <output class="grid-field" id="N">0</output>
	</fieldset>

	<fieldset class="fieldset-flex">
		<legend>Graphics</legend>

		<label class="form-line">
			<modal-button>
				<span slot="button">Points Count</span>
				<div slot="modal">
					<p>Number of points in the cube</p>
				</div>
			</modal-button>
		  <input type="text" inputmode="numeric" id="points-count" />
		</label>

		<label class="form-line">
			<modal-button>
				<span slot="button">Cube Side</span>
				<div slot="modal">
					<p>Side of the cube (in light-years).</p>
				</div>
			</modal-button>
		  <input type="text" inputmode="numeric" id="cube-side" />
		</label>

		<label class="form-line">
			<modal-button>
				<span slot="button">Visual Unit</span>
				<div slot="modal">
					<p>Number of light-years per ThreeJS unit.</p>
				</div>
			</modal-button>
		  <input type="text" inputmode="numeric" id="visual-unit" />
		</label>

		<label class="form-line">
			<modal-button>
				<span slot="button">Rotation</span>
				<div slot="modal">
					<p>Rotation angle of the cube per second.</p>
				</div>
			</modal-button>
		  <input type="text" inputmode="numeric" id="rotation" />
		</label>

    <label class="form-line">
      <modal-button>
        <span slot="button">Live Color</span>
        <div slot="modal">
          <p>Color of the live signal.</p>
        </div>
      </modal-button>
      <input type="color" id="live-color" />
    </label>

    <label class="form-line">
      <modal-button>
        <span slot="button">Dead Color</span>
        <div slot="modal">
          <p>Color of the dead signal.</p>
        </div>
      </modal-button>
      <input type="color" id="dead-color" />
    </label>

		<label class="checkbox-line">
			<span>Live Signal</span>
			<input type="checkbox" id="live-signal" />
		</label>

		<label class="checkbox-line">
			<span>Dead Signal</span>
			<input type="checkbox" id="dead-signal" />
		</label>

		<label class="form-line">
			<modal-button>
				<span slot="button">KDTree Search</span>
				<div slot="modal">
					<p>Number of lights to search in KDTree.</p>
				</div>
			</modal-button>
		  <input type="text" inputmode="numeric" id="kdtree-search" />
		</label>
	</fieldset>
</form>

<div class="button-line">
	<input form="drake-form" type="submit" value="Apply" />
	<button title="Reset" id="reset-button">
		<i class="fa-solid fa-arrow-rotate-left"></i>
	</button>
	<input form="drake-form" type="reset" value="Cancel" />
</div>
`

class ApplyStatus {
  static #_FAILURE = 0
  static #_SUCCESS = 1
  static #_HARD_RESET = 2

  static get FAILURE() { return this.#_FAILURE }
  static get SUCCESS() { return this.#_SUCCESS }
  static get HARD_RESET() { return this.#_HARD_RESET }
}

const validate = ({ target }) => {
  const value = parseFloat(target.value)
  let validity = ''
  if (target.value === '') {
    validity = 'Value required'
  } else if (isNaN(value)) {
    validity = 'Not a number'
  }
  target.setCustomValidity(validity)
  return validity
}

class SettingsDialog extends CustomDialog {
  constructor() {
    super()
    this.innerHTML = SettingsDialogHTML

    this._restart
    const resetButton = this.querySelector('#reset-button')
    resetButton.addEventListener('click', () => this._resetForm())

    this._form = this.querySelector('#drake-form')
    const textInputs = this._form.querySelectorAll('input[type="text"]')
    textInputs.forEach((input) => input.addEventListener('input', validate))
    this._form.addEventListener('input', () => this._updateResults())
  }

  setup({ settingsButton, controlPanel }) {
    settingsButton.addEventListener('click', () => {
      this._resetForm()
      this._restart = controlPanel.isPlaying
      if (controlPanel.isPlaying) controlPanel.playPauseToggle()
      this.showModal()
    })

    this.addEventListener('submit', (e) => {
      const outputs = this._form.querySelectorAll('output')
      for (const output of outputs) {
        const validity = validate({ target: output })
        if (validity !== '') {
          alert(`${output.id}: ${validity}`)
          e.preventDefault()
          return
        }
      }
      switch (this._applyForm()) {
        case ApplyStatus.FAILURE:      e.preventDefault()
          break
        case ApplyStatus.HARD_RESET:   controlPanel.hardReset()
          break
        case ApplyStatus.SUCCESS:
          break
      }
    })
    this.addEventListener('reset', () => this.close())
    this.addEventListener('close', () => {
      if (this._restart) controlPanel.playPauseToggle()
    })
  }

  _setFormValue({ name, value }) {
    const element = this._form.querySelector(`#${name}`)
    switch (element.tagName) {
      case 'INPUT':
        if (element.type === 'text') {
          element.value = formatNumber(value, 8, 6, true)
          validate({ target: element })
        } else if (element.type === 'checkbox') {
          element.checked = value
        } else if (element.type === 'color') {
          element.value = `#${value.toString(16).padStart(6, '0')}`
        }
        break
      case 'SELECT':
        element.value = value
        break
      case 'OUTPUT':
        element.value = formatNumber(value, 8, 6, true)
        break
    }
  }

  _getFormValue({ name }) {
    const element = this._form.querySelector(`#${name}`)
    switch (element.tagName) {
      case 'INPUT':
        if (element.type === 'text') return parseFloat(element.value)
        else if (element.type === 'checkbox') return element.checked
        else if (element.type === 'color') {
          return parseInt(element.value.slice(1), 16)
        }
        break
      case 'SELECT':
        return element.value
        break
      case 'OUTPUT':
        return parseFloat(element.value)
        break
    }
  }

  _updateResults() {
    const formMultiply = (result, name) => {
      const value = this._getFormValue({ name })
      return result * (Number.isNaN(value) ? 0 : value)
    }
    this._setFormValue({
      name: 'N',
      value: ['time', 'spawn-rate'].reduce(formMultiply, 1),
    })
  }

  _applyForm() {
    const values = {}
    let hardReset = []
    for (const name in config) {
      if (Object.getOwnPropertyDescriptor(config, name).get) continue
      const value = this._getFormValue({ name })
      if (this.querySelector(`#${name}`).closest('fieldset')
        .querySelector('legend').textContent === 'Graphics'
        && value !== config[name]) {
        hardReset.push(name)
      }
      values[name] = value
    }

    // In case of hard reset prompt user to confirm
    if (hardReset.length > 0) {
      const message = `The following parameters have been changed: ${hardReset.join(', ')}. This will trigger a hard reset. Do you want to proceed?`
      if (!confirm(message)) return ApplyStatus.FAILURE
    }

    for (const name in values) {
      config[name] = values[name]
    }

    return hardReset.length > 0 ? ApplyStatus.HARD_RESET : ApplyStatus.SUCCESS
  }

  _resetForm() {
    for (const name in config) {
      if (Object.getOwnPropertyDescriptor(config, name).get) continue
      this._setFormValue({ name, value: config[name] })
    }
    this._updateResults()
  }
}

customElements.define('settings-dialog', SettingsDialog, { extends: 'dialog' })
