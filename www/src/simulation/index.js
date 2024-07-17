import { starPoints } from './stars.js'
import { galaxySpec } from './constants.js'
import { config, drakeResult } from './config.js'
import { randomFloat, randomNormal } from './math.js'

class Civilization {
  constructor({ birth, index, x, y, z }) {
    this.birth = Math.floor(birth)
    this.star = index
    this.coord = { x, y, z }

    const lifetime = config['civilization-lifetime'].current
    const stddev = config['lifetime-stddev'].current
    const randomLifetime = Math.ceil(randomNormal(lifetime, stddev))
    this.lifetime = randomLifetime < 1 ? 1 : randomLifetime
  }
}

export class Simulation {
  constructor() {
    // Each star is an { x, y, z } coordinate point in Light Year units
    this.stars = starPoints({
      centerRadius: galaxySpec.CENTER_DIAMETER / 2,
      radius: galaxySpec.DIAMETER / 2,
      height: galaxySpec.HEIGHT,
    })

    // Current year (floating point number)
    this.time = 0

    // Civilizations
    this.civilizations = []
  }

  get starCount() {
    return this.stars.length
  }

  isAlive({ civilization }) {
    return civilization.birth + civilization.lifetime > this.time
  }

  _spawn({ delta, spawnRate, speed }) {
    const newCivilizations = []
    const elapsed = speed * delta
    const rate = spawnRate * delta

    for (let year = 0; year < elapsed; year++) {
      let count = 0
      if (rate >= 1) {
        count = Math.round(randomFloat(rate / 2, rate + rate / 2))
      } else if (randomFloat(0, 1) <= rate) {
        count++
      }

      for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * this.starCount)
        const { x, y, z } = this.stars[index]
        const birth = this.time + year
        const civilization = new Civilization({ birth, index, x, y, z })
        newCivilizations.push(civilization)
      }
    }

    return newCivilizations
  }

  tick({ delta }) {
    const { spawnRate } = drakeResult
    const speed = config['speed'].current

    const newCivilizations = this._spawn({ delta, spawnRate, speed })
    this.civilizations = this.civilizations.concat(newCivilizations)
    this.time += speed * delta

    return newCivilizations
  }
}
