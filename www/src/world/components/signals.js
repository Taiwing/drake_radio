import {
  Line,
  Group,
  BufferGeometry,
  LineBasicMaterial,
  Float32BufferAttribute,
} from '../vendor/three.js'
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
    const { geometry, material } = createCircle(config['visual-light-year'], color)
    super(geometry, material)

    this._material = material
    this.scale.x = scale
    this.scale.y = scale
    this.scale.z = scale
    this.position.set(
      origin.x * config['visual-light-year'],
      origin.y * config['visual-light-year'],
      origin.z * config['visual-light-year']
    )
    this._radiusMax = dto + config['cube-side'] * this._reduction(count+1)
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

const MAX_SIGNALS = 50

export class Signals extends Group {
  constructor({ camera, color, eventName }) {
    super()
    this._color = color
    this._eventName = eventName
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
    const civilizations = events[this._eventName]

    for (const civ of civilizations) {
      if (this.children.length >= MAX_SIGNALS) break
      const elapsed = time - civ[this._eventName]
      this._createBubble({ elapsed, civ })
    }
  }

  tick({ time, isRunning, elapsed, events }) {
    if (isRunning) {
      this._inflateBubbles({ elapsed })
      this._handleEvent({ time, events })
    } else {
      this.children.forEach((bubble) => bubble.cameraTick())
    }
  }
}
