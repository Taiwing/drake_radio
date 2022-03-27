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

const resetDrakeForm = () => {
  for (const name of Object.keys(drakeFormParameters)) {
    const { def, current } = drakeFormParameters[name]
    const element = document.getElementById(name)
    element.value = def.toString()
    if (current === undefined) drakeFormParameters[name].current = def
  }
}

const randomInt = (min, max) => {
  return Math.random() * max + min
}

const randomDrakeForm = () => {
  for (const name of Object.keys(drakeFormParameters)) {
    const { min, max, randomMax } = drakeFormParameters[name]
    const element = document.getElementById(name)
    element.value = randomInt(min, randomMax || max).toFixed(2)
  }
}

export default () => {
  const resetButton = document.querySelector('#reset-button')
  const randomButton = document.querySelector('#random-button')
  const configButton = document.querySelector('#config-button')
  const configDialog = document.querySelector('#config-dialog')
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
  })
  resetDrakeForm()
}
