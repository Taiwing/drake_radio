import { randomFloat } from './simulation/math.js'
import { config, drakeResult } from './simulation/config.js'

const fields = Object.keys(config)
const drakeParameters = fields.filter(name => config[name].isDrakeParameter)

const updateEquationResult = () => {
  const formResult = document.getElementById('N')
  const formYearlyResult = document.getElementById('Ny')

  let result = 1
  let yearlyResult = 1
  for (name of drakeParameters) {
    const element = document.getElementById(name)
    const value = parseFloat(element.value)
    result *= Number.isNaN(value) ? 0 : value
    if (name !== 'civilization-lifetime') {
      yearlyResult *= Number.isNaN(value) ? 0 : value
    }
  }
  formResult.value = result.toFixed(4)
  formYearlyResult.value = yearlyResult.toFixed(8)
}

const resetDrakeForm = () => {
  for (const name of fields) {
    const { def } = config[name]
    const element = document.getElementById(name)
    if (element.type === 'text') element.value = def.toString()
    else if (element.type === 'checkbox') element.checked = def
  }
  updateEquationResult()
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
    const element = document.getElementById(name)
    const value = element.type === 'text' ? parseFloat(element.value)
      : element.type === 'checkbox' ? element.checked : undefined
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
  drakeResult.spawnRate = parseFloat(document.getElementById('Ny').value)
  drakeResult.total = parseFloat(document.getElementById('N').value)

  return hardReset.length > 0 ? SaveStatus.HARD_RESET : SaveStatus.SUCCESS
}

const initDrakeForm = () => {
  for (const name of fields) {
    const { current } = config[name]
    const element = document.getElementById(name)
    if (element.type === 'text') element.value = current.toString()
    else if (element.type === 'checkbox') element.checked = current
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
  saveDrakeForm()
}

export const setupDrakeDialog = ({ controls }) => {
  const resetButton = document.getElementById('reset-button')
  const randomButton = document.getElementById('random-button')
  const configButton = document.getElementById('config-button')
  const configDialog = document.getElementById('config-dialog')
  const form = document.getElementById('drake-form')
  let restart

  resetButton.addEventListener('click', resetDrakeForm)
  randomButton.addEventListener('click', randomDrakeForm)
  configButton.addEventListener('click', () => {
    if (typeof configDialog.showModal === 'function') {
      initDrakeForm()
      restart = controls.loop
      if (controls.loop) controls.playPauseToggle()
      configDialog.showModal()
    } else {
      console.log('The <dialog> API is not implemented on this browser.')
    }
  })
  configDialog.addEventListener('submit', (e) => {
    const { returnValue } = configDialog
    if (returnValue === 'save') {
      switch (saveDrakeForm()) {
        case SaveStatus.FAILURE:      e.preventDefault()
          break
        case SaveStatus.HARD_RESET:   controls.hardReset()
          break
        case SaveStatus.SUCCESS:
          break
      }
    }
  })
  configDialog.addEventListener('reset', () => configDialog.close())
  configDialog.addEventListener('close', () => {
    if (restart) controls.playPauseToggle()
  })
  form.addEventListener('input', updateEquationResult)
}
