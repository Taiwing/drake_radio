export const config = {
  'new-stars-rate': {
    min: 0,
    max: 1_000_000,
    randomMax: 5,
    isDrakeParameter: true,
   },
  'planet-fraction': {
    min: 0,
    max: 1,
    isDrakeParameter: true,
  },
  'habitable-average': {
    min: 0,
    max: 1_000_000,
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
    max: 1_000_000_000_000,
    randomMax: 10_000,
    isDrakeParameter: true,
  },
  'lifetime-stddev': {
    min: 0,
    max: 1_000_000_000_000,
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
    'lifetime-stddev': 152,
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
    'lifetime-stddev': 152,
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
    'lifetime-stddev': 152,
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
    'lifetime-stddev': 1000,
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
    'civilization-lifetime': 1e9,
    'lifetime-stddev': 1e6,
    'speed': 200,
  },
}

export const drakeResult = {
  'spawnRate': 0,
  'total': 0,
}
