import { formatNumber } from './utils.js'
import { randomFloat } from './simulation/math.js'
import { config, presets, drakeResult } from './simulation/config.js'

const fields = Object.keys(config)
const drakeParameters = fields.filter(name => config[name].isDrakeParameter)

const setFormValue = ({ name, value }) => {
  const element = document.getElementById(name)
  switch (element.tagName) {
    case 'INPUT':
      if (element.type === 'text') {
          element.value = formatNumber(value, 8, 6, true)
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

const updateEquationResult = () => {
  let result = 1
  let yearlyResult = 1
  for (name of drakeParameters) {
    const value = getFormValue({ name })
    result *= Number.isNaN(value) ? 0 : value
    if (name !== 'civilization-lifetime') {
      yearlyResult *= Number.isNaN(value) ? 0 : value
    }
  }
  setFormValue({ name: 'N', value: result })
  setFormValue({ name: 'Ny', value: yearlyResult })
}

const applyPreset = ({ name }) => {
  const preset = presets[name]
  for (const field in preset) {
    const value = preset[field]
    setFormValue({ name: field, value })
  }
}

const resetDrakeForm = () => {
  for (const name of fields) {
    if (config[name].def === undefined) continue
    const { def } = config[name]
    setFormValue({ name, value: def })
  }
  applyPreset({ name: config['preset'].def })
}

class SaveStatus {
  static #_FAILURE = 0
  static #_SUCCESS = 1
  static #_HARD_RESET = 2

  static get FAILURE() { return this.#_FAILURE }
  static get SUCCESS() { return this.#_SUCCESS }
  static get HARD_RESET() { return this.#_HARD_RESET }
}

const saveDrakeForm = () => {
  const values = {}
  let hardReset = []
  for (const name of fields) {
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
    if (!confirm(message)) return SaveStatus.FAILURE
  }

  for (const name of fields) config[name].current = values[name]
  drakeResult.spawnRate = getFormValue({ name: 'Ny' })
  drakeResult.total = getFormValue({ name: 'N' })

  return hardReset.length > 0 ? SaveStatus.HARD_RESET : SaveStatus.SUCCESS
}

const initDrakeForm = () => {
  for (const name of fields) {
    const { current } = config[name]
    setFormValue({ name, value: current })
  }
  updateEquationResult()
}

const randomDrakeForm = () => {
  for (const name of drakeParameters) {
    const { min, max, randomMax } = config[name]
    const element = document.getElementById(name)
    element.value = randomFloat(min, randomMax || max).toFixed(2)
  }
  updateEquationResult()
}

export const setupDrakeConfig = () => {
  resetDrakeForm()
  updateEquationResult()
  saveDrakeForm()
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
      restart = controls.on
      if (controls.on) controls.playPauseToggle()
      configDialog.showModal()
    } else {
      console.log('The <dialog> API is not implemented on this browser.')
    }
  })
  configDialog.addEventListener('submit', (e) => {
    switch (saveDrakeForm()) {
      case SaveStatus.FAILURE:      e.preventDefault()
        break
      case SaveStatus.HARD_RESET:   controls.hardReset()
        break
      case SaveStatus.SUCCESS:
        break
    }
  })
  configDialog.addEventListener('reset', () => configDialog.close())
  configDialog.addEventListener('close', () => {
    if (restart) controls.playPauseToggle()
  })
  form.addEventListener('input', (e) => {
    updateEquationResult()
    const { id } = e.target
    const preset = config['preset'].current
    // Remove current preset setting if one of its values is modified
    if (preset && presets[preset][id] !== undefined) {
      setFormValue({ name: 'preset', value: "" })
    }
  })
  preset.addEventListener('input', (e) => {
    const { value } = e.target
    if (!value) return
    applyPreset({ name: value })
    updateEquationResult()  //TODO: checkout if is useful
  })
}
