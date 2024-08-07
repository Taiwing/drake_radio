import { starPoints } from './stars.js'
import { insertSorted } from '../utils.js'
import { galaxySpec } from './constants.js'
import { config } from './config.js'
import { randomFloat, distanceToOrigin } from './math.js'

export class Civilization {
  constructor({ birth, index, x, y, z }) {
    this.birth = birth
    this.death = -1
    this.gone = -1
    this.star = index
    this.coord = { x, y, z }
    this._id = Civilization.counter
    this.distanceToOrigin = distanceToOrigin(this.coord)
    this.goneRadius = galaxySpec.TOTAL_RADIUS + this.distanceToOrigin
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

  kill(time) {
    this.death = time
    this.gone = time + this.goneRadius
  }

  isVisible(time) {
    return this.gone < 0 || time < this.gone
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
    this.dead = []      // Dead but signals still visible
    this.gone = []      // Dead and all signals have left the galaxy

    // Simulation state
    this.isRunning = false
  }

  get starCount() {
    return this.stars.length
  }

  // Create new civilizations according to simulation parameters
  _spawn({ spawnRate, elapsed }) {
    const born = []

    let count = 0
    if (spawnRate >= 1) {
      count = Math.round(randomFloat(spawnRate / 2, spawnRate + spawnRate / 2))
    } else if (randomFloat(0, 1) <= spawnRate) {
      count = 1
    }

    if (count > 0) {
      const timeSlice = elapsed / count
      let timeOffset = 0
      for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * this.starCount)
        const { x, y, z } = this.stars[index]
        const birth = this.time + timeOffset
        born.push(new Civilization({ birth, index, x, y, z }))
        timeOffset += timeSlice
      }
      this.living = this.living.concat(born)
    }
    return born
  }

  // Kill civilizations and move them to dead
  _kill({ spawnRate, elapsed }) {
    let dead = []
    const currentN = this.living.length
    const averageN = config['N']

    let killRate
    if (averageN > 0) {
      killRate = spawnRate * currentN / averageN
    } else {
      killRate = spawnRate * currentN
    }

    let count = 0
    if (killRate >= 1) {
      count = Math.round(randomFloat(killRate / 2, killRate + killRate / 2))
    } else if (randomFloat(0, 1) <= killRate) {
      count = 1
    }

    if (count > 0) {
      let timeOffset = -elapsed
      const timeSlice = elapsed / count
      // TODO: maybe find a way to efficiently randomize this (shuffle and
      // splice count or randomize indexes and splice each one)
      dead = this.living.splice(0, count)
      for (const civ of dead) {
        let death = this.time + timeOffset
        death = death <= civ.birth ? civ.birth + timeSlice : death
        death = death > this.time ? this.time : death
        civ.kill(death)
        insertSorted(this.dead, civ, (a, b) => b.gone - a.gone)
        timeOffset += timeSlice
      }
    }
    return dead
  }

  // Move civilizations that are not dead anymore to gone
  _forget() {
    const gone = []

    let lastDead = this.dead.length - 1
    while (lastDead >= 0) {
      const civ = this.dead[lastDead]
      if (civ.isVisible(this.time)) break
      else gone.push(civ)
      lastDead--
    }
    this.dead = this.dead.slice(0, lastDead + 1)
    this.gone = this.gone.concat(gone)
    return gone
  }

  onTick() {}

  tick({ delta }) {
    const elapsed = config['speed'] * delta
    const spawnRate = config['Ny'] * elapsed

    const birth = this._spawn({ spawnRate, elapsed })
    this.time += elapsed
    const death = this._kill({ spawnRate, elapsed })
    const gone = this._forget()

    if (this.onTick) this.onTick()

    return { birth, death, gone }
  }
}
