export const config = {
  'new-stars-rate': {
    min: 0,
    max: 1000,
    randomMax: 4,
    isDrakeParameter: true,
   },
  'planet-fraction': {
    min: 0,
    max: 1,
    isDrakeParameter: true,
  },
  'habitable-average': {
    min: 0,
    max: 1000,
    randomMax: 1,
    isDrakeParameter: true,
  },
  'life-fraction': {
    min: 0,
    max: 1,
    isDrakeParameter: true,
  },
  'intelligence-fraction': {
    min: 0,
    max: 1,
    isDrakeParameter: true,
  },
  'communication-fraction': {
    min: 0,
    max: 1,
    isDrakeParameter: true,
  },
  'civilization-lifetime': {
    min: 0,
    max: 1_000_000_000,
    randomMax: 10_000,
    isDrakeParameter: true,
  },
  'Ny': {
    min: 0,
    max: 1,
  },
  'N': {
    min: 0,
    max: 2e+5,
  },
  'speed': {
    min: 1,
    max: 1e+8,
  },
  'rotation': {
    def: true,
  },
  'star-cloud': {
    def: true,
    hardReset: true,
  },
  'first-signals': {
    def: true,
    hardReset: true,
  },
  'last-signals': {
    def: true,
    hardReset: true,
  },
  'preset': {
    def: 'reasonable',
  },
}

export const drakeParameters = Object.keys(config).filter(
  name => config[name].isDrakeParameter
)
export const yearlyParameters = drakeParameters.filter(
  name => name !== 'civilization-lifetime'
)

const defaultPresets = {
  /* Rare Earth Hypothesis */
  'pessimistic': {
    'new-stars-rate': 1.5,
    'planet-fraction': 0.9,
    'habitable-average': 0.45,
    'life-fraction': 2.47e-5,
    'intelligence-fraction': 1e-9,
    'communication-fraction': 0.2,
    'civilization-lifetime': 304,
    'speed': 1e8,
  },
  /* Intelligent Life is Rare */
  'conservative': {
    'new-stars-rate': 1.5,
    'planet-fraction': 0.9,
    'habitable-average': 0.45,
    'life-fraction': 0.1,
    'intelligence-fraction': 1e-9,
    'communication-fraction': 0.2,
    'civilization-lifetime': 304,
    'speed': 2e6,
  },
  /* Middle of the Road Estimations */
  'reasonable': {
    'new-stars-rate': 1.5,
    'planet-fraction': 0.9,
    'habitable-average': 0.45,
    'life-fraction': 0.1,
    'intelligence-fraction': 0.01,
    'communication-fraction': 0.75,
    'civilization-lifetime': 304,
    'speed': 4000,
  },
  /* Longer Lifetime for Civilizations */
  'optimistic': {
    'new-stars-rate': 2,
    'planet-fraction': 1,
    'habitable-average': 0.45,
    'life-fraction': 0.13,
    'intelligence-fraction': 0.05,
    'communication-fraction': 0.75,
    'civilization-lifetime': 10_000,
    'speed': 1000,
  },
  /* Largest Estimates */
  'star-trek': {
    'new-stars-rate': 3,
    'planet-fraction': 1,
    'habitable-average': 0.2,
    'life-fraction': 0.13,
    'intelligence-fraction': 1,
    'communication-fraction': 0.2,
    'civilization-lifetime': 1.282051e+7,
    'speed': 1000,
    'first-signals': true,
    'last-signals': true,
  },
}

export const presets = {}

export const applyConfig = (values) => {
  for (const name in values) {
    config[name].current = values[name]
  }
}

const loadStoredPresets = () => {
  let storedPresets = localStorage.getItem('presets')
  if (!storedPresets) {
    localStorage.setItem('presets', JSON.stringify(defaultPresets))
    storedPresets = defaultPresets
  } else {
    storedPresets = JSON.parse(storedPresets)
  }
  for (const name in storedPresets) {
    presets[name] = storedPresets[name]
  }
}

const loadStoredConfig = () => {
  let storedConfig = localStorage.getItem('config')
  if (storedConfig) {
    storedConfig = JSON.parse(storedConfig)
    for (const name in storedConfig) {
      config[name].def = storedConfig[name]
    }
  }
}

const configMultiply = (result, name) => result * config[name].current

export const initConfig = () => {
  loadStoredConfig()
  for (const name in config) {
    const { def } = config[name]
    if (def !== undefined) {
      config[name].current = def
    }
  }

  loadStoredPresets()
  const { def } = config['preset']
  applyConfig(presets[def])

  config['N'].current = drakeParameters.reduce(configMultiply, 1)
  config['Ny'].current = yearlyParameters.reduce(configMultiply, 1)
}
