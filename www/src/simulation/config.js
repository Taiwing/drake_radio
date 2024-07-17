export const config = {
  'new-stars-rate': {
    def: 1.5,
    min: 0,
    max: 1_000_000,
    randomMax: 5,
    isDrakeParameter: true,
   },
  'planet-fraction': {
    def: 0.9,
    min: 0,
    max: 1,
    isDrakeParameter: true,
  },
  'habitable-average': {
    def: 0.45,
    min: 0,
    max: 1_000_000,
    randomMax: 1,
    isDrakeParameter: true,
  },
  'life-fraction': {
    def: 0.1,
    min: 0,
    max: 1,
    isDrakeParameter: true,
  },
  'intelligence-fraction': {
    //def: 0.01,
    def: 0.0722, //TEMP
    min: 0,
    max: 1,
    isDrakeParameter: true,
  },
  'communication-fraction': {
    def: 0.75,
    min: 0,
    max: 1,
    isDrakeParameter: true,
  },
  'civilization-lifetime': {
    def: 304,
    min: 0,
    max: 1_000_000_000_000,
    randomMax: 10_000,
    isDrakeParameter: true,
  },
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
  'rotation': {
    def: true,
  },
  'star-cloud': {
    def: true,
    hardReset: true,
  }
}

export const drakeResult = {
  'spawnRate': 0,
  'total': 0,
}
