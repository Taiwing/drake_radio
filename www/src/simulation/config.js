// Configuration template for the Drake Equation simulation. Sets the default
// values for the simulation parameters as well as limit values for the drake
// parameters.
export const configTemplate = {
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
  'birth-signals-count': {
    def: 50,
  },
  'birth-signals-color': {
    def: 0x66acdc,
  },
  'birth-signals-inflate': {
    def: true,
  },
  'death-signals-count': {
    def: 50,
  },
  'death-signals-color': {
    def: 0xbf1111,
  },
  'death-signals-inflate': {
    def: false,
  },
  'preset': {
    def: 'reasonable',
  },
}

// Default configuration presets for the simulation.
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
  },
}

export let configDefaults = {}  // Default values for the simulation parameters
export let config = {}          // Current values for the simulation parameters
export let presets = {}         // Presets for the simulation parameters

// Drake parameters that are used to compute N.
export const drakeParameters = Object.keys(configTemplate).filter(
  name => configTemplate[name].isDrakeParameter
)

// Drake parameters that are used to compute Ny.
export const yearlyParameters = drakeParameters.filter(
  name => name !== 'civilization-lifetime'
)

export const applyConfig = (values) => {
  for (const name in values) {
    config[name] = values[name]
  }
}

export const loadStoredPresets = () => {
  let storedPresets = localStorage.getItem('presets')
  if (!storedPresets) {
    localStorage.setItem('presets', JSON.stringify(defaultPresets))
    storedPresets = localStorage.getItem('presets')
  }
  presets = JSON.parse(storedPresets)
}

export const loadStoredConfigDefaults = () => {
  let storedConfigDefaults = localStorage.getItem('configDefaults')
  if (!storedConfigDefaults) {
    const defaultConfigDefaults = {}
    for (const name in configTemplate) {
      const { def } = configTemplate[name]
      if (def !== undefined) {
        defaultConfigDefaults[name] = def
      }
    }
    localStorage.setItem(
      'configDefaults',
      JSON.stringify(defaultConfigDefaults)
    )
    storedConfigDefaults = localStorage.getItem('configDefaults')
  }
  configDefaults = JSON.parse(storedConfigDefaults)
}

const configMultiply = (result, name) => result * config[name]

export const initConfig = () => {
  loadStoredConfigDefaults()
  loadStoredPresets()

  for (const name in configTemplate) {
    config[name] = configDefaults[name]
  }
  const def = configDefaults['preset']
  applyConfig(presets[def])

  config['N'] = drakeParameters.reduce(configMultiply, 1)
  config['Ny'] = yearlyParameters.reduce(configMultiply, 1)
}
