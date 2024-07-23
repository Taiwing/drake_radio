import { starPoints } from './stars.js'
import { insertSorted } from '../utils.js'
import { galaxySpec } from './constants.js'
import { config, drakeResult } from './config.js'
import { randomFloat, randomNormal, distanceToOrigin } from './math.js'

export class Civilization {
  constructor({ birth, index, x, y, z }) {
    this.birth = Math.floor(birth)
    this.star = index
    this.coord = { x, y, z }
    this._id = Civilization.counter

    const lifetime = config['civilization-lifetime'].current
    const stddev = config['lifetime-stddev'].current
    const randomLifetime = Math.ceil(randomNormal(lifetime, stddev))
    const dto = distanceToOrigin(this.coord)

    this.lifetime = randomLifetime < 1 ? 1 : randomLifetime
    this.death = this.birth + this.lifetime
    this.gone = this.death + galaxySpec.TOTAL_RADIUS + dto
  }

  get id() {
    return this._id
  }

  static get counter() {
    Civilization._counter = (Civilization._counter || 0) + 1
    return Civilization._counter
  }

  static get count() {
    return Civilization._counter || 0
  }

  static reset() {
    Civilization._counter = 0
  }

  isAlive(time) {
    return time < this.death
  }

  isVisible(time) {
    return time < this.gone
  }
}

export class Simulation {
  constructor() {
    // Each star is an { x, y, z } coordinate point in Light Year units
    this.stars = starPoints({
      centerRadius: galaxySpec.CENTER_RADIUS,
      radius: galaxySpec.RADIUS,
      height: galaxySpec.HEIGHT,
    })

    // Current year (floating point number)
    this.time = 0

    // Civilizations
    this.living = []    // Still emitting signals
    this.visible = []   // Dead but signals still visible
    this.gone = []      // Dead and all signals have left the galaxy
  }

  get starCount() {
    return this.stars.length
  }

  // Create new civilizations according to simulation parameters
  _spawn({ delta, spawnRate, speed }) {
    const born = []
    const elapsed = speed * delta
    const rate = spawnRate * elapsed

    let count = 0
    if (rate >= 1) {
      count = Math.round(randomFloat(rate / 2, rate + rate / 2))
    } else if (randomFloat(0, 1) <= rate) {
      count = 1
    }

    if (count > 0) {
      const timeSlice = elapsed / count
      let timeOffset = 0
      for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * this.starCount)
        const { x, y, z } = this.stars[index]
        const birth = this.time + timeOffset
        const civilization = new Civilization({ birth, index, x, y, z })
        born.push(civilization)
        insertSorted(this.living, civilization, (a, b) => b.death - a.death)
        timeOffset += timeSlice
      }
    }

    return born
  }

  // Move dead civilizations to visible
  _kill() {
    const dead = []

    let lastLiving = this.living.length - 1
    while (lastLiving >= 0) {
      const civ = this.living[lastLiving]
      if (civ.isAlive(this.time)) break
      else {
        dead.push(civ)
        insertSorted(this.visible, civ, (a, b) => b.gone - a.gone)
      }
      lastLiving--
    }
    this.living = this.living.slice(0, lastLiving + 1)
    return dead
  }

  // Move civilizations that are not visible anymore to gone
  _forget() {
    const gone = []

    let lastVisible = this.visible.length - 1
    while (lastVisible >= 0) {
      const civ = this.visible[lastVisible]
      if (civ.isVisible(this.time)) break
      else gone.push(civ)
      lastVisible--
    }
    this.visible = this.visible.slice(0, lastVisible + 1)
    this.gone = this.gone.concat(gone)
    return gone
  }

  tick({ delta }) {
    const { spawnRate } = drakeResult
    const speed = config['speed'].current

    const birth = this._spawn({ delta, spawnRate, speed })
    this.time += speed * delta
    const death = this._kill()
    const gone = this._forget()

    if (this.onTick) this.onTick()

    return { birth, death, gone }
  }
}
