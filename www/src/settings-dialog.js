import { formatNumber, capitalize } from './utils.js'
import { randomFloat } from './simulation/math.js'
import {
  config,
  presets,
  applyConfig,
  configTemplate,
  configDefaults,
  drakeParameters,
  yearlyParameters,
} from './simulation/config.js'
import { CustomDialog } from './custom-dialog.js'

const SettingsDialogHTML = `
<h3>Settings</h3>
<dialog is="presets-dialog"></dialog>
<form id="drake-form" method="dialog">
  <fieldset class="fieldset-grid">
    <legend>Drake Equation</legend>
    <label class="grid-label" for="preset">Preset</label>
    <div class="grid-field" id="presets-field">
      <select name="preset" id="preset"></select>
      <button type="button" title="Edit Presets" id="presets-button">
        <i class="fa-solid fa-pen-to-square"></i>
      </button>
    </div>
    <label class="grid-label" for="new-stars-rate">
      <modal-button>
        <span slot="button">R<sub>*</sub></span>
        <div slot="modal">
          <p>
            The average number of stars formed per year
            in the galaxy.
          </p>
        </div>
      </modal-button>
    </label>
    <input
      type="text"
      inputmode="numeric"
      id="new-stars-rate"
      class="grid-field"
    />
    <label class="grid-label" for="planet-fraction">
      <modal-button>
        <span slot="button">f<sub>p</sub></span>
        <div slot="modal">
          <p>
            The fraction of stars that have planets
            (between 0 and 1).
          </p>
        </div>
      </modal-button>
    </label>
    <input
      type="text"
      inputmode="numeric"
      id="planet-fraction"
      class="grid-field"
    />
    <label class="grid-label" for="habitable-average">
      <modal-button>
        <span slot="button">n<sub>e</sub></span>
        <div slot="modal">
          <p>
            Average number of planets that can support
            life per star that has planets.
          </p>
        </div>
      </modal-button>
    </label>
    <input
      type="text"
      inputmode="numeric"
      id="habitable-average"
      class="grid-field"
    />
    <label class="grid-label" for="life-fraction">
      <modal-button>
        <span slot="button">f<sub>l</sub></span>
        <div slot="modal">
          <p>
            The fraction of habitable planets on which
            life actually develops (between 0 and 1).
          </p>
        </div>
      </modal-button>
    </label>
    <input
      type="text"
      inputmode="numeric"
      id="life-fraction"
      class="grid-field"
    />
    <label class="grid-label" for="intelligence-fraction">
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
    </label>
    <input
      type="text"
      inputmode="numeric"
      id="intelligence-fraction"
      class="grid-field"
    />
    <label class="grid-label" for="communication-fraction">
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
    </label>
    <input
      type="text"
      inputmode="numeric"
      id="communication-fraction"
      class="grid-field"
    />
    <label class="grid-label" for="civilization-lifetime">
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
    </label>
    <input
      type="text"
      inputmode="numeric"
      id="civilization-lifetime"
      class="grid-field"
    />
  </fieldset>

  <fieldset class="fieldset-grid">
    <legend>Results</legend>
    <label class="grid-label" for="Ny">
      <modal-button>
        <span slot="button">N<sub>y</sub>:</span>
        <div slot="modal">
          <p>
            The average number of detectable
            civilizations appearing each year in the
            galaxy. Is the product of all the Drake
            Equation factors except L.
          </p>
        </div>
      </modal-button>
    </label>
    <output class="grid-field" id="Ny">0</output>
    <label class="grid-label" for="N">
      <modal-button>
        <span slot="button">N:</span>
        <div slot="modal">
          <p>
            The number of civilizations in the galaxy
            with which communication might be possible.
            Is the product of all the Drake Equation
            factors.
          </p>
        </div>
      </modal-button>
    </label>
    <output class="grid-field" id="N">0</output>
  </fieldset>

  <fieldset class="fieldset-flex">
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
      <span>Galactic Rotation</span>
      <input type="checkbox" id="rotation" />
    </label>
  </fieldset>

  <fieldset class="fieldset-flex">
    <legend>
      <modal-button>
        <span slot="button">Birth Signals</span>
        <div slot="modal">
          <p>
            First signal emitted by a technological civilization.
          </p>
        </div>
      </modal-button>
    </legend>
    <label class="form-line">
      <span>Color</span>
      <input type="color" id="birth-signals-color" />
    </label>
    <label class="form-line">
      <modal-button>
        <span slot="button">Count</span>
        <div slot="modal">
          <p>
            Maximum number of birth signals to show.
          </p>
        </div>
      </modal-button>
      <input
        type="text"
        inputmode="numeric"
        id="birth-signals-count"
      />
    </label>
  </fieldset>

  <fieldset class="fieldset-flex">
    <legend>
      <modal-button>
        <span slot="button">Death Signals</span>
        <div slot="modal">
          <p>
            Last signal emitted by a technological civilization.
          </p>
        </div>
      </modal-button>
    </legend>
    <label class="form-line">
      <span>Color</span>
      <input type="color" id="death-signals-color" />
    </label>
    <label class="form-line">
      <modal-button>
        <span slot="button">Count</span>
        <div slot="modal">
          <p>
            Maximum number of death signals to show.
          </p>
        </div>
      </modal-button>
      <input
        type="text"
        inputmode="numeric"
        id="death-signals-count"
      />
    </label>
  </fieldset>
</form>

<div class="button-line">
  <input form="drake-form" type="submit" value="Apply" />
  <button title="Save As" id="save-button">
    <i class="fa-solid fa-floppy-disk"></i>
  </button>
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
  const { min, max } = configTemplate[target.id]
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
    const saveButton = this.querySelector('#save-button')
    saveButton.addEventListener('click', () => this._saveForm())
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
      this._setFormValue({ name: 'preset', value: "" })
    })

    this._preset = this.querySelector('#preset')
    this._reloadPresets()
    this._preset.addEventListener('change', ({ target }) => {
      saveButton.disabled = !!target.value
    })
    this._preset.addEventListener('input', ({ target }) => {
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

    const presetsButton = this.querySelector('#presets-button')
    const presetDialog = this.querySelector('[is="presets-dialog"]')
    presetDialog.setup({ presetsButton })
    presetDialog.onSubmit = (presetMap) => {
      const selected = this._preset.value
      const current = config['preset']
      this._reloadPresets()
      const newSelected = selected in presetMap ? presetMap[selected] : ''
      config['preset'] = current in presetMap ? presetMap[current] : ''
      this._setFormValue({ name: 'preset', value: newSelected })
    }
  }

  _setFormValue({ name, value }) {
    const element = this._form.querySelector(`#${name}`)
    switch (element.tagName) {
      case 'INPUT':
        if (element.type === 'text') {
          element.value = formatNumber(value, 8, 6, true)
          validate({ target: element })
        } else if (element.type === 'color') {
          element.value = `#${value.toString(16).padStart(6, '0')}`
        } else if (element.type === 'checkbox') {
          element.checked = value
        }
        break
      case 'SELECT':
        element.value = value
        element.dispatchEvent(new Event('change'))
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
        if (element.type === 'text') {
          return parseFloat(element.value)
        } else if (element.type === 'color') {
          return parseInt(element.value.slice(1), 16)
        } else if (element.type === 'checkbox') {
          return element.checked
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

  _initForm() {
    this._reloadPresets()
    for (const name in config) {
      this._setFormValue({ name, value: config[name] })
    }
  }

  _addPresetOption(value, name) {
    const option = document.createElement('option')
    option.value = value
    option.textContent = name ? name : capitalize(value.replace('-', ' '))
    this._preset.append(option)
  }

  _reloadPresets() {
    this._preset.innerHTML = ''
    this._addPresetOption('', '-- None --')
    for (const preset in presets) {
      this._addPresetOption(preset)
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
      if (configTemplate[name].hardReset
        && config[name] !== undefined
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

    applyConfig(values)

    return hardReset.length > 0 ? ApplyStatus.HARD_RESET : ApplyStatus.SUCCESS
  }

  _randomForm() {
    for (const name of drakeParameters) {
      const { min, max, randomMax } = configTemplate[name]
      const element = this._form.querySelector(`#${name}`)
      element.value = randomFloat(min, randomMax || max).toFixed(2)
    }
    this._updateResults()
    this._setFormValue({ name: 'preset', value: "" })
  }

  _resetForm() {
    for (const name in configDefaults) {
      this._setFormValue({ name, value: configDefaults[name] })
    }
    this._applyPreset({ name: configDefaults['preset'] })
    this._updateResults()
  }

  _saveForm() {
    const name = prompt('Enter a name for the preset')
    if (!name) return
    const preset = {}
    for (const field in configTemplate) {
      if (['preset', 'Ny', 'N'].includes(field)) continue
      const value = this._getFormValue({ name: field })
      if (value !== configDefaults[field]) {
        preset[field] = value
      }
    }
    presets[name] = preset
    localStorage.setItem('presets', JSON.stringify(presets))
    this._reloadPresets()
    this._setFormValue({ name: 'preset', value: name })
  }
}

customElements.define('settings-dialog', SettingsDialog, { extends: 'dialog' })
