const drakeFormParameters = {
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
    def: 0.4,
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

const updateEquationResult = () => {
  const formResult = document.getElementById('N')

  let result = 1
  for (name in drakeFormParameters) {
    const element = document.getElementById(name)
    const value = parseFloat(element.value)
    result *= Number.isNaN(value) ? 0 : value
  }
  formResult.value = result.toFixed(4)
}

const resetDrakeForm = () => {
  for (const name in drakeFormParameters) {
    const { def, current } = drakeFormParameters[name]
    const element = document.getElementById(name)
    element.value = def.toString()
    if (current === undefined) drakeFormParameters[name].current = def
  }
  updateEquationResult()
}

const randomInt = (min, max) => {
  return Math.random() * max + min
}

const randomDrakeForm = () => {
  for (const name in drakeFormParameters) {
    const { min, max, randomMax } = drakeFormParameters[name]
    const element = document.getElementById(name)
    element.value = randomInt(min, randomMax || max).toFixed(2)
  }
  updateEquationResult()
}

export default () => {
  const resetButton = document.getElementById('reset-button')
  const randomButton = document.getElementById('random-button')
  const configButton = document.getElementById('config-button')
  const configDialog = document.getElementById('config-dialog')
  const form = document.getElementById('drake-form')
  const formResult = document.getElementById('N')

  resetButton.addEventListener('click', resetDrakeForm)
  randomButton.addEventListener('click', randomDrakeForm)
  configButton.addEventListener('click', () => {
    if (typeof configDialog.showModal === 'function') {
      configDialog.showModal()
    } else {
      console.log('The <dialog> API is not implemented on this browser.')
    }
  })
  configDialog.addEventListener('close', () => {
    console.log(`The button ${configDialog.returnValue} has been clicked!`)
    //TODO: update current values on save
  })
  formResult.for = Object.keys(drakeFormParameters).join(' ')
  form.addEventListener('input', updateEquationResult)
  resetDrakeForm()
}
