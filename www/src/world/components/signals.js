import {
  Line,
  Group,
  BufferGeometry,
  LineBasicMaterial,
  Float32BufferAttribute,
} from '../vendor/three.js'
import {
  CIV_LIFE_COLOR,
  CIV_DEATH_COLOR,
  VISUAL_LIGHT_YEAR,
} from '../constants.js'
import { galaxySpec } from '../../simulation/constants.js'

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

  constructor({ x, y, z, dto, count, delta, speed, color }) {
    const scale = speed * delta
    const radius = VISUAL_LIGHT_YEAR
    const { geometry, material } = createCircle(radius, color)

    super(geometry, material)

    this.color = color
    this._material = material
    this.scale.x = scale
    this.scale.y = scale
    this.scale.z = scale
    this.position.set(
      x * VISUAL_LIGHT_YEAR,
      y * VISUAL_LIGHT_YEAR,
      z * VISUAL_LIGHT_YEAR
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

  tick({ delta, speed, count }) {
    const decay = this._reduction(count)

    // Make the sphere grow as per the simulation parameters
    const growth = speed * delta
    if (this.scale.x < this._radiusMax * decay) {
      this.scale.x += growth
      this.scale.y += growth
      this.scale.z += growth
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
  constructor({ camera, showFirst, showLast}) {
    super()
    Bubble.camera = camera
    this._showFirst = showFirst
    this._showLast = showLast
    this._firstCount = 0
    this._lastCount = 0
  }

  _createBubble({ delta, speed, civ, count, color }) {
    const { x, y, z } = civ.coord
    const dto = civ.distanceToOrigin
    this.add(new Bubble({ x, y, z, dto, count, delta, speed, color }))
  }

  _inflateBubbles({ delta, speed }) {
    const { length } = this.children
    for (let i = length - 1; i >= 0; i--) {
      const bubble = this.children[i]
      if (bubble.color === CIV_LIFE_COLOR) {
        if (!bubble.tick({ delta, speed, count: this._firstCount })) {
          this.remove(bubble)
          this._firstCount--
        }
      } else {
        if (!bubble.tick({ delta, speed, count: this._lastCount })) {
          this.remove(bubble)
          this._lastCount--
        }
      }
    }
  }

  _handleEvents({ delta, speed, events }) {
    const { birth, death } = events

    if (this._showFirst) {
      const color = CIV_LIFE_COLOR
      for (const civ of birth) {
        if (this._firstCount >= MAX_SIGNALS) break
        this._createBubble({ delta, speed, civ, count: this._firstCount, color })
        this._firstCount++
      }
    }

    if (this._showLast) {
      const color = CIV_DEATH_COLOR
      for (const civ of death) {
        if (this._lastCount >= MAX_SIGNALS) break
        this._createBubble({ delta, speed, civ, count: this._lastCount, color })
        this._lastCount++
      }
    }
  }

  tick({ isRunning, delta, speed, events }) {
    if (isRunning) {
      this._inflateBubbles({ delta, speed })
      this._handleEvents({ delta, speed, events })
    } else {
      this.children.forEach((bubble) => bubble.cameraTick())
    }
  }
}
