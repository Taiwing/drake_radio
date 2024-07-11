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
    def: 0.01,
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
      drakeEquation[name].current = value
    } else {
      simulation[name].current = value
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

const randomDrakeForm = () => {
  for (const name of fields) {
    const { min, max, randomMax } = drakeEquation[name] || simulation[name]
    const element = document.getElementById(name)
    element.value = randomFloat(min, randomMax || max).toFixed(2)
  }
  updateEquationResult()
}

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
  //TEST
  if (spawnCount > 0) {
    console.log(`speed = ${simulation['speed'].current} years/second`)
    console.log(`spawnRate = ${spawnRate}`)
    console.log(`spawnCount = ${spawnCount}`)
    console.log({ delta, elapsed, rate })
  }
  //TEST
  return spawnCount
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
