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
  /*
  if (hardReset.length > 0) {
    const message = `The following parameters have been changed: ${hardReset.join(', ')}. This will trigger a hard reset. Do you want to proceed?`
    if (!confirm(message)) return false
  }
  */

  for (const name of fields) config[name].current = values[name]
  drakeResult.spawnRate = parseFloat(document.getElementById('Ny').value)
  drakeResult.total = parseFloat(document.getElementById('N').value)

  /*
  if (hardReset.length > 0) {
    const event = new Event('hardReset')
    document.getElementById('config-dialog').dispatchEvent(event)
  }
  */

  return true
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

const randomFloat = (min, max) => {
  return Math.random() * max + min
}

const _2PI = Math.PI * 2

function randomNormal(mean, stddev) {
  if (randomNormal.z1 !== undefined) {
    const result = randomNormal.z1 * stddev + mean
    randomNormal.z1 = undefined
    return result
  }

  const u1 = Math.random()
  const u2 = Math.random()

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(_2PI * u2)
  randomNormal.z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(_2PI * u2)

  return z0 * stddev + mean
}

const randomDrakeForm = () => {
  for (const name of drakeParameters) {
    const { min, max, randomMax } = config[name]
    const element = document.getElementById(name)
    element.value = randomFloat(min, randomMax || max).toFixed(2)
  }
  updateEquationResult()
}

export const drakeSimulation = ({ delta }) => {
  const { spawnRate } = drakeResult
  const simulationSpeed = config['speed'].current

  let elapsed = simulationSpeed * delta
  let rate = spawnRate * delta
  let spawnCount = 0
  for (let year = 0; year < elapsed; year++) {
    if (rate >= 1) {
      const count = randomFloat(rate / 2, rate + rate / 2)
      spawnCount += Math.round(count)
    } else if (randomFloat(0, 1) <= rate) {
      spawnCount++
    }
  }

  const civilizations = []
  const lifetime = config['civilization-lifetime'].current
  const stddev = config['lifetime-stddev'].current
  for (let i = 0; i < spawnCount; i++) {
    let randomLifetime = Math.ceil(randomNormal(lifetime, stddev))
    randomLifetime = randomLifetime < 1 ? 1 : randomLifetime
    civilizations.push(randomLifetime)
  }

  return civilizations
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
    if (returnValue === 'save' && !saveDrakeForm()) {
      e.preventDefault()
    }
  })
  configDialog.addEventListener('reset', () => configDialog.close())
  configDialog.addEventListener('close', () => {
    if (restart) controls.playPauseToggle()
  })
  form.addEventListener('input', updateEquationResult)
  resetDrakeForm()
  saveDrakeForm()
}
