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
  constructor({ camera }) {
    super()
    Bubble.camera = camera
    this.civSignalCount = 0
  }

  _createBubble({ delta, speed, civ, count }) {
    const { x, y, z } = civ.coord
    const dto = civ.distanceToOrigin
    const color = civ.death === -1 ? CIV_LIFE_COLOR : CIV_DEATH_COLOR
    this.add(new Bubble({ x, y, z, dto, count, delta, speed, color }))
  }

  _inflateBubbles({ delta, speed }) {
    const count = this.children.length
    for (let i = count - 1; i >= 0; i--) {
      const bubble = this.children[i]
      if (!bubble.tick({ delta, speed, count: this.civSignalCount })) {
        if (bubble.color === CIV_LIFE_COLOR) this.civSignalCount--
        this.remove(bubble)
      }
    }
  }

  _handleEvents({ delta, speed, events }) {
    const { birth, death } = events

    for (const civ of birth) {
      if (this.civSignalCount >= MAX_SIGNALS) break
      this._createBubble({ delta, speed, civ, count: this.civSignalCount })
      civ.signalCount = this.civSignalCount
      this.civSignalCount++
    }

    for (const civ of death) {
      if (civ.signalCount === undefined) continue
      this._createBubble({ delta, speed, civ, count: civ.signalCount })
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
