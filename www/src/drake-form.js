import { formatNumber } from './utils.js'
import { randomFloat } from './simulation/math.js'
import {
  config,
  presets,
  applyConfig,
  drakeParameters,
  yearlyParameters,
} from './simulation/config.js'

const setFormValue = ({ name, value }) => {
  const element = document.getElementById(name)
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

const getFormValue = ({ name }) => {
  const element = document.getElementById(name)
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

const formMultiply = (result, name) => {
  const value = getFormValue({ name })
  return result * (Number.isNaN(value) ? 0 : value)
}

const updateEquationResult = () => {
  setFormValue({ name: 'N', value: drakeParameters.reduce(formMultiply, 1) })
  setFormValue({ name: 'Ny', value: yearlyParameters.reduce(formMultiply, 1) })
}

const applyPreset = ({ name }) => {
  const preset = presets[name]
  for (const field in preset) {
    const value = preset[field]
    setFormValue({ name: field, value })
  }
}

const resetDrakeForm = () => {
  for (const name in config) {
    if (config[name].def === undefined) continue
    const { def } = config[name]
    setFormValue({ name, value: def })
  }
  applyPreset({ name: config['preset'].def })
}

class ApplyStatus {
  static #_FAILURE = 0
  static #_SUCCESS = 1
  static #_HARD_RESET = 2

  static get FAILURE() { return this.#_FAILURE }
  static get SUCCESS() { return this.#_SUCCESS }
  static get HARD_RESET() { return this.#_HARD_RESET }
}

const applyDrakeForm = () => {
  const values = {}
  let hardReset = []
  for (const name in config) {
    const value = getFormValue({ name })
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

const initDrakeForm = () => {
  for (const name in config) {
    const { current } = config[name]
    setFormValue({ name, value: current })
  }
}

const randomDrakeForm = () => {
  for (const name of drakeParameters) {
    const { min, max, randomMax } = config[name]
    const element = document.getElementById(name)
    element.value = randomFloat(min, randomMax || max).toFixed(2)
  }
  updateEquationResult()
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

export const setupDrakeDialog = ({ controls }) => {
  const resetButton = document.getElementById('reset-button')
  const randomButton = document.getElementById('random-button')
  const configButton = document.getElementById('config-button')
  const configDialog = document.getElementById('config-dialog')
  const form = document.getElementById('drake-form')
  const preset = document.getElementById('preset')
  let restart

  resetButton.addEventListener('click', resetDrakeForm)
  randomButton.addEventListener('click', randomDrakeForm)
  configButton.addEventListener('click', () => {
    if (typeof configDialog.showModal === 'function') {
      initDrakeForm()
      restart = controls.isPlaying
      if (controls.isPlaying) controls.playPauseToggle()
      configDialog.showModal()
    } else {
      console.log('The <dialog> API is not implemented on this browser.')
    }
  })
  configDialog.addEventListener('submit', (e) => {
    const outputs = form.querySelectorAll('output')
    for (const output of outputs) {
      const validity = validate({ target: output })
      if (validity !== '') {
        alert(`${output.id}: ${validity}`)
        e.preventDefault()
        return
      }
    }
    switch (applyDrakeForm()) {
      case ApplyStatus.FAILURE:      e.preventDefault()
        break
      case ApplyStatus.HARD_RESET:   controls.hardReset()
        break
      case ApplyStatus.SUCCESS:
        break
    }
  })
  configDialog.addEventListener('reset', () => configDialog.close())
  configDialog.addEventListener('close', () => {
    if (restart) controls.playPauseToggle()
  })
  form.addEventListener('input', ({ target }) => {
    const { id } = target
    if (!drakeParameters.includes(id)) return
    updateEquationResult()
    if (config['preset'].current) setFormValue({ name: 'preset', value: "" })
  })
  preset.addEventListener('input', ({ target }) => {
    const { value } = target
    if (!value) return
    applyPreset({ name: value })
    updateEquationResult()
  })
  form.querySelectorAll('input[type="text"]').forEach((element) => {
    element.addEventListener('input', validate)
  })
}
