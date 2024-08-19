import {
  Line,
  Group,
  BufferGeometry,
  LineBasicMaterial,
  Float32BufferAttribute,
} from '../vendor/three.js'
import { VISUAL_LIGHT_YEAR } from '../constants.js'
import { galaxySpec } from '../../simulation/constants.js'
import { config } from '../../simulation/config.js'

// Create a circle geometry
const createCircle = (radius, color, segments = 64) => {
  const geometry = new BufferGeometry()
  const vertices = []

  for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      vertices.push(radius * Math.cos(theta), radius * Math.sin(theta), 0)
  }

  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  const material = new LineBasicMaterial({ color })
  return { geometry, material }
}

export class Bubble extends Line {
  static camera = null

  constructor({ origin, dto, count, scale, color }) {
    const { geometry, material } = createCircle(VISUAL_LIGHT_YEAR, color)
    super(geometry, material)

    this.material = material
    this.scale.x = scale
    this.scale.y = scale
    this.scale.z = scale
    this.position.set(
      origin.x * VISUAL_LIGHT_YEAR,
      origin.y * VISUAL_LIGHT_YEAR,
      origin.z * VISUAL_LIGHT_YEAR
    )
    this._radiusMax = dto + galaxySpec.TOTAL_RADIUS * this._reduction(count+1)
  }

  get _radiusMiddle() {
    return this._radiusMax / 2
  }

  _reduction(x) {
    return Math.pow(1/x, 1/2)
  }

  cameraTick() {
    this.lookAt(Bubble.camera.position)
  }

  tick({ elapsed, count }) {
    const decay = this._reduction(count)

    // Make the sphere grow as per the simulation parameters
    if (this.scale.x < this._radiusMax * decay) {
      this.scale.x += elapsed
      this.scale.y += elapsed
      this.scale.z += elapsed
    }

    // Pop the bubble if it reached its maximum size
    if (this.scale.x >= this._radiusMax * decay) {
      return false
    }

    this.cameraTick()

    return true
  }
}

export class Signals extends Group {
  constructor({ camera, type }) {
    super()
    this._color = config[`${type}-signals-color`]
    this._count = config[`${type}-signals-count`]
    this._type = type
    Bubble.camera = camera
  }

  _createBubble({ elapsed, civ }) {
    const bubble = new Bubble({
      origin: civ.coord,
      dto: civ.distanceToOrigin,
      count: this.children.length,
      scale: elapsed,
      color: this._color,
    })
    this.add(bubble)
  }

  _inflateBubbles({ elapsed }) {
    const { length } = this.children
    for (let i = length - 1; i >= 0; i--) {
      const bubble = this.children[i]
      if (!bubble.tick({ elapsed, count: this.children.length })) {
        this.remove(bubble)
      }
    }
  }

  _handleEvent({ time, events }) {
    const civilizations = events[this._type]

    for (const civ of civilizations) {
      if (this.children.length >= this._count) break
      const elapsed = time - civ[this._type]
      this._createBubble({ elapsed, civ })
    }
  }

  tick({ time, isRunning, elapsed, events }) {
    if (config[`${this._type}-signals-count`] !== this._count) {
      this._count = config[`${this._type}-signals-count`]
      while (this.children.length > this._count) {
        this.remove(this.children[0])
      }
    }
    if (config[`${this._type}-signals-color`] !== this._color) {
      this._color = config[`${this._type}-signals-color`]
      this.children.forEach((bubble) => {
        bubble.material.color.set(this._color)
      })
    }

    if (isRunning) {
      this._inflateBubbles({ elapsed })
      this._handleEvent({ time, events })
    } else {
      this.children.forEach((bubble) => bubble.cameraTick())
    }
  }
}
