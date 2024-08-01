import { formatNumber } from './utils.js'
import { randomFloat } from './simulation/math.js'
import {
  config,
  presets,
  applyConfig,
  drakeParameters,
  yearlyParameters,
} from './simulation/config.js'
import { CustomDialog } from './custom-dialog.js'

const SettingsDialogHTML = `
<h3>Settings</h3>
<form id="drake-form" method="dialog">
	<fieldset>
		<legend>Drake Equation</legend>
		<label class="form-line">
			<span>Preset</span>
			<select name="preset" id="preset">
				<option value="">-- None --</option>
				<option value="pessimistic">Pessimistic</option>
				<option value="conservative">Conservative</option>
				<option value="reasonable">Reasonable</option>
				<option value="optimistic">Optimistic</option>
				<option value="star-trek">Star Trek</option>
			</select>
		</label>
		<label class="form-line">
			<modal-button>
				<span slot="button">R<sub>*</sub></span>
				<div slot="modal">
					<p>
						The average number of stars formed per year
						in the galaxy.
					</p>
				</div>
			</modal-button>
			<input
				type="text"
				inputmode="numeric"
				id="new-stars-rate"
			/>
		</label>
		<label class="form-line">
			<modal-button>
				<span slot="button">f<sub>p</sub></span>
				<div slot="modal">
					<p>
						The fraction of stars that have planets
						(between 0 and 1).
					</p>
				</div>
			</modal-button>
			<input
				type="text"
				inputmode="numeric"
				id="planet-fraction"
			/>
		</label>
		<label class="form-line">
			<modal-button>
				<span slot="button">n<sub>e</sub></span>
				<div slot="modal">
					<p>
						Average number of planets that can support
						life per star that has planets.
					</p>
				</div>
			</modal-button>
			<input
				type="text"
				inputmode="numeric"
				id="habitable-average"
			/>
		</label>
		<label class="form-line">
			<modal-button>
				<span slot="button">f<sub>l</sub></span>
				<div slot="modal">
					<p>
						The fraction of habitable planets on which
						life actually develops (between 0 and 1).
					</p>
				</div>
			</modal-button>
			<input
				type="text"
				inputmode="numeric"
				id="life-fraction"
			/>
		</label>
		<label class="form-line">
			<modal-button>
				<span slot="button">f<sub>i</sub></span>
				<div slot="modal">
					<p>
						The fraction of inhabited planets that
						develop intelligent life, thus civilization
						(between 0 and 1).
					</p>
				</div>
			</modal-button>
			<input
				type="text"
				inputmode="numeric"
				id="intelligence-fraction"
			/>
		</label>
		<label class="form-line">
			<modal-button>
				<span slot="button">f<sub>c</sub></span>
				<div slot="modal">
					<p>
						The fraction of civilizations that develop a
						technology releasing detectable signs of
						their existence into space (between 0 and
						1).
					</p>
				</div>
			</modal-button>
			<input
				type="text"
				inputmode="numeric"
				id="communication-fraction"
			/>
		</label>
		<label class="form-line">
			<modal-button>
				<span slot="button">L</span>
				<div slot="modal">
					<p>
						Length of time for which technological
						civilizations release detectable signals
						into space (in years).
					</p>
				</div>
			</modal-button>
			<input
				type="text"
				inputmode="numeric"
				id="civilization-lifetime"
			/>
		</label>
	</fieldset>

	<fieldset>
		<legend>Results</legend>
		<label class="form-line">
			<modal-button>
				<span slot="button">N<sub>y</sub>:</span>
				<div slot="modal">
					<p>
						The average number of detectable
						civilizations appearing each year in the
						galaxy.
					</p>
				</div>
			</modal-button>
			<output id="Ny">0</output>
		</label>
		<label class="form-line">
			<modal-button>
				<span slot="button">N:</span>
				<div slot="modal">
					<p>
						The number of civilizations in the galaxy
						with which communication might be possible.
					</p>
				</div>
			</modal-button>
			<output id="N">0</output>
		</label>
	</fieldset>

	<fieldset>
		<legend>Simulation</legend>
		<label class="form-line">
			<modal-button>
				<span slot="button">Speed</span>
				<div slot="modal">
					<p>
						Simulation speed in year(s) per second.
					</p>
				</div>
			</modal-button>
			<input
				type="text"
				inputmode="numeric"
				id="speed"
			/>
		</label>
		<label class="checkbox-line">
			<span>Star Cloud</span>
			<input type="checkbox" id="star-cloud" />
		</label>
		<label class="checkbox-line">
			<span>First Signals</span>
			<input type="checkbox" id="first-signals" />
		</label>
		<label class="checkbox-line">
			<span>Last Signals</span>
			<input type="checkbox" id="last-signals" />
		</label>
		<label class="checkbox-line">
			<span>Galactic Rotation</span>
			<input type="checkbox" id="rotation" />
		</label>
	</fieldset>
</form>

<div class="button-line">
	<input form="drake-form" type="submit" value="Apply" />
	<button title="Random" id="random-button">
		<i class="fa-solid fa-dice-six"></i>
	</button>
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
  const { min, max } = config[target.id]
  let validity = ''
  if (target.value === '') {
    validity = 'Value required'
  } else if (isNaN(value)) {
    validity = 'Not a number'
  } else if (value < min) {
    validity = `Value too low (min: ${min})`
  } else if (value > max) {
    validity = `Value too high (max: ${max})`
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
    const randomButton = this.querySelector('#random-button')
    randomButton.addEventListener('click', () => this._randomForm())

    this._form = this.querySelector('#drake-form')
    this._form.querySelectorAll('input[type="text"]').forEach((element) => {
      element.addEventListener('input', validate)
    })
    this._form.addEventListener('input', ({ target }) => {
      const { id } = target
      if (!drakeParameters.includes(id)) return
      this._updateResults()
      if (config['preset'].current) {
        this._setFormValue({ name: 'preset', value: "" })
      }
    })

    const preset = this.querySelector('#preset')
    preset.addEventListener('input', ({ target }) => {
      const { value } = target
      if (!value) return
      this._applyPreset({ name: value })
      this._updateResults()
    })
  }

  setup({ settingsButton, controlPanel }) {
    settingsButton.addEventListener('click', () => {
      this._initForm()
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
        break
      case 'SELECT':
        return element.value
        break
      case 'OUTPUT':
        return parseFloat(element.value)
        break
    }
  }

  _initForm() {
    for (const name in config) {
      const { current } = config[name]
      this._setFormValue({ name, value: current })
    }
  }

  _applyPreset({ name }) {
    const preset = presets[name]
    for (const field in preset) {
      const value = preset[field]
      this._setFormValue({ name: field, value })
    }
  }

  _updateResults() {
    const formMultiply = (result, name) => {
      const value = this._getFormValue({ name })
      return result * (Number.isNaN(value) ? 0 : value)
    }
    this._setFormValue({
      name: 'N',
      value: drakeParameters.reduce(formMultiply, 1),
    })
    this._setFormValue({
      name: 'Ny',
      value: yearlyParameters.reduce(formMultiply, 1),
    })
  }

  _applyForm() {
    const values = {}
    let hardReset = []
    for (const name in config) {
      const value = this._getFormValue({ name })
      if (config[name].hardReset
        && config[name].current !== undefined
        && value !== config[name].current) {
        hardReset.push(name)
      }
      values[name] = value
    }

    // In case of hard reset prompt user to confirm
    if (hardReset.length > 0) {
      const message = `The following parameters have been changed: ${hardReset.join(', ')}. This will trigger a hard reset. Do you want to proceed?`
      if (!confirm(message)) return ApplyStatus.FAILURE
    }

    applyConfig(values)

    return hardReset.length > 0 ? ApplyStatus.HARD_RESET : ApplyStatus.SUCCESS
  }

  _randomForm() {
    for (const name of drakeParameters) {
      const { min, max, randomMax } = config[name]
      const element = this._form.querySelector(`#${name}`)
      element.value = randomFloat(min, randomMax || max).toFixed(2)
    }
    this._updateResults()
    if (config['preset'].current) {
      this._setFormValue({ name: 'preset', value: "" })
    }
  }

  _resetForm() {
    for (const name in config) {
      if (config[name].def === undefined) continue
      const { def } = config[name]
      this._setFormValue({ name, value: def })
    }
    this._applyPreset({ name: config['preset'].def })
    this._updateResults()
  }
}

customElements.define('settings-dialog', SettingsDialog, { extends: 'dialog' })