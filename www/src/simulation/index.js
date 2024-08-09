import { starPoints } from './stars.js'
import { insertSorted } from '../utils.js'
import { config } from './config.js'
import { randomFloat, distanceToOrigin } from './math.js'
import { KDTree } from './kd-tree.js'

export class Light {
  constructor({ birth, index, x, y, z }) {
    this.birth = birth
    this.death = -1
    this.gone = -1
    this.star = index
    this.coord = { x, y, z }
    this._id = Light.counter
    this.distanceToOrigin = distanceToOrigin(this.coord)
    this.goneRadius = config['cube-side'] / 2 + this.distanceToOrigin
  }

  get id() {
    return this._id
  }

  static get counter() {
    Light._counter = (Light._counter || 0) + 1
    return Light._counter
  }

  static get count() {
    return Light._counter || 0
  }

  static reset() {
    Light._counter = 0
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
      count: config['points-count'],
      cubeSide: config['cube-side'],
    })
    this.stars.forEach((star, index) => star.index = index)
    this.starTree = new KDTree(this.stars, ['x', 'y', 'z'])

    // Current year (floating point number)
    this.time = 0

    // Lights
    this.on = []    // Still emitting light
    this.off = []   // Off but light  still visible
    this.gone = []  // Off and all ligt has left
    this.lightQueries = []

    // Simulation state
    this.isRunning = false
  }

  get starCount() {
    return this.stars.length
  }

  // Create new lights according to simulation parameters
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
        const light = new Light({ birth, index, x, y, z })
        born.push(light)
        if (this.lightQueries.length < config['kdtree-search']) {
          this.lightQueries.push(light)
        }
        timeOffset += timeSlice
      }
      this.on = this.on.concat(born)
    }
    return born
  }

  // Kill lights and move them to off
  _kill({ spawnRate, elapsed }) {
    let off = []
    const currentN = this.on.length
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
      off = this.on.splice(0, count)
      for (const light of off) {
        let death = this.time + timeOffset
        death = death <= light.birth ? light.birth + timeSlice : death
        death = death > this.time ? this.time : death
        light.kill(death)
        insertSorted(this.off, light, (a, b) => b.gone - a.gone)
        timeOffset += timeSlice
      }
    }
    return off
  }

  // Move lights that are not off anymore to gone
  _forget() {
    const gone = []

    let lastOff = this.off.length - 1
    while (lastOff >= 0) {
      const light = this.off[lastOff]
      if (light.isVisible(this.time)) break
      else {
        gone.push(light)
        if (this.lightQueries.includes(light)) {
          this.lightQueries.splice(this.lightQueries.indexOf(light), 1)
        }
      }
      lastOff--
    }
    this.off = this.off.slice(0, lastOff + 1)
    this.gone = this.gone.concat(gone)
    return gone
  }

  _getBalls() {
    const balls = []
    for (const light of this.lightQueries) {
      const radius =  this.time - light.birth
      const ball = this.starTree.nearest_within_R(light.coord, radius)
      balls.push(ball)
    }
    return balls
  }

  onTick() {}

  tick({ delta }) {
    const elapsed = config['speed'] * delta
    const spawnRate = config['spawn-rate'] * elapsed

    const birth = this._spawn({ spawnRate, elapsed })
    this.time += elapsed
    const death = this._kill({ spawnRate, elapsed })
    const gone = this._forget()
    const balls = this._getBalls()

    if (this.onTick) this.onTick()

    return { birth, death, gone, balls }
  }
}
