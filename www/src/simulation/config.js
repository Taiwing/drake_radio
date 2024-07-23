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
  'speed': {
    min: 1,
    max: 10_000_000,
  },
  'rotation': {
    def: true,
  },
  'star-cloud': {
    def: true,
    hardReset: true,
  },
  'bubbles': {
    def: true,
    hardReset: true,
  },
  'preset': {
    def: 'reasonable',
  },
}

export const presets = {
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
    'speed': 500,
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
    'speed': 250,
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
    'speed': 200,
  },
  /* Debug (one) */
  // TODO: Remove this preset or only show in dev mode
  'debug': {
    'new-stars-rate': 1,
    'planet-fraction': 1,
    'habitable-average': 1,
    'life-fraction': 1,
    'intelligence-fraction': 1,
    'communication-fraction': 1,
    'civilization-lifetime': 1,
    'speed': 200,
    'bubbles': false,
  },
}

/*
export const drakeResult = {
  'spawnRate': {
    min: 0,
    max: 1000,
  },
  'total': {
    min: 0,
    max: 200_000,
  },
}
*/

export const drakeResult = {
  'spawnRate': 0,
  'total': 0,
}
