export const drakeEquation = {
  'new-stars-rate': {
    def: 1.5,
    min: 0,
    max: 1_000_000,
    randomMax: 5,
   },
  'planet-fraction': {
    def: 0.9,
    min: 0,
    max: 1,
  },
  'habitable-average': {
    def: 0.45,
    min: 0,
    max: 1_000_000,
    randomMax: 1,
  },
  'life-fraction': {
    def: 0.1,
    min: 0,
    max: 1,
  },
  'intelligence-fraction': {
    //def: 0.01,
    def: 0.0722, //TEMP
    min: 0,
    max: 1,
  },
  'communication-fraction': {
    def: 0.75,
    min: 0,
    max: 1,
  },
  'civilization-lifetime': {
    def: 304,
    min: 0,
    max: 1_000_000_000_000,
    randomMax: 1_000_000_000,
  },
}

//TBD
export const simulation = {
  'lifetime-stddev': {
    def: 152,
    min: 0,
    max: 1_000_000_000_000,
  },
  'speed': {
    def: 40_000,
    min: 1,
    max: 10_000_000,
  },
}

export const drakeResult = {
  'spawnRate': 0,
  'total': 0,
}

const fields = Object.keys(drakeEquation).concat(Object.keys(simulation))

const updateEquationResult = () => {
  const formResult = document.getElementById('N')
  const formYearlyResult = document.getElementById('Ny')

  let result = 1
  let yearlyResult = 1
  for (name in drakeEquation) {
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
    const { def } = drakeEquation[name] || simulation[name]
    const element = document.getElementById(name)
    element.value = def.toString()
  }
  updateEquationResult()
}

const saveDrakeForm = () => {
  for (const name of fields) {
    const { value } = document.getElementById(name)
    if (drakeEquation[name]) {
      drakeEquation[name].current = parseFloat(value)
    } else {
      simulation[name].current = parseFloat(value)
    }
  }
  drakeResult.spawnRate = document.getElementById('Ny').value
  drakeResult.total = document.getElementById('N').value
}

const initDrakeForm = () => {
  for (const name of fields) {
    const { current } = drakeEquation[name] || simulation[name]
    const element = document.getElementById(name)
    element.value = current
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
  for (const name of fields) {
    const { min, max, randomMax } = drakeEquation[name] || simulation[name]
    const element = document.getElementById(name)
    element.value = randomFloat(min, randomMax || max).toFixed(2)
  }
  updateEquationResult()
}

let toto = true

export const drakeSimulation = ({ delta }) => {
  const { spawnRate } = drakeResult
  const simulationSpeed = simulation['speed'].current

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
  const lifetime = drakeEquation['civilization-lifetime'].current
  const stddev = simulation['lifetime-stddev'].current
  for (let i = 0; i < spawnCount; i++) {
    let randomLifetime = Math.ceil(randomNormal(lifetime, stddev))
    randomLifetime = randomLifetime < 1 ? 1 : randomLifetime
    civilizations.push(randomLifetime)
  }

  return civilizations
}

export default () => {
  const resetButton = document.getElementById('reset-button')
  const randomButton = document.getElementById('random-button')
  const configButton = document.getElementById('config-button')
  const configDialog = document.getElementById('config-dialog')
  const form = document.getElementById('drake-form')

  resetButton.addEventListener('click', resetDrakeForm)
  randomButton.addEventListener('click', randomDrakeForm)
  configButton.addEventListener('click', () => {
    if (typeof configDialog.showModal === 'function') {
      initDrakeForm()
      configDialog.showModal()
    } else {
      console.log('The <dialog> API is not implemented on this browser.')
    }
  })
  configDialog.addEventListener('close', () => {
    const { returnValue } = configDialog
    if (returnValue === 'save') saveDrakeForm()
  })
  form.addEventListener('input', updateEquationResult)
  resetDrakeForm()
  saveDrakeForm()
}
