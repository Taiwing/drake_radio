import {
  Group,
  LineSegments,
  LineBasicMaterial,
  SphereGeometry,
  WireframeGeometry,
} from '../vendor/three.js'

import { VISUAL_LIGHT_YEAR, CIV_LIFE_COLOR } from '../constants.js'
import { galaxySpec } from '../../simulation/constants.js'

const MAX_OPACITY = 1
const BASE_OPACITY = MAX_OPACITY / 2
const FLICKER = 1

export class Bubble extends LineSegments {
  constructor({ x, y, z, delta, speed }) {
    const scale = speed * delta
    const sphereGeometry = new SphereGeometry(VISUAL_LIGHT_YEAR, 32, 32)
    const geometry = new WireframeGeometry(sphereGeometry)
    const material = new LineBasicMaterial({
      color: CIV_LIFE_COLOR,
      transparent: true,
      opacity: BASE_OPACITY + BASE_OPACITY * Math.abs(Math.sin(delta * FLICKER)),
    })

    super(geometry, material)

    this._material = material
    this._baseOpacity = BASE_OPACITY
    this.scale.x = scale
    this.scale.y = scale
    this.scale.z = scale
    this.position.set(
      x * VISUAL_LIGHT_YEAR,
      y * VISUAL_LIGHT_YEAR,
      z * VISUAL_LIGHT_YEAR
    )
  }

  get _radiusMax() {
    return galaxySpec.RADIUS
  }

  get _radiusMiddle() {
    return this._radiusMax / 2
  }

  _reduction(x) {
    const k1 = Math.log(19) / 40
    const reduction = 1 / (1 + Math.exp(k1 * x))
    return reduction < 0.1 ? 0.1 : reduction
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

    // Dimming the sphere when it is passed its middle life
    if (this.scale.x >= this._radiusMiddle * decay) {
      const dim = BASE_OPACITY / (this._radiusMiddle * decay / growth)
      this._baseOpacity -= dim
    }

    // Flickering effect
    this._material.opacity = this._baseOpacity +
      BASE_OPACITY * Math.abs(Math.sin(this.scale.x / speed * FLICKER))

    return true
  }
}

const MAX_SIGNALS = 75

export class Signals extends Group {
  constructor() {
    super()
    this._bubbles = []
  }

  _createBubble({ delta, speed, civilization }) {
    const { x, y, z } = civilization.coord
    const bubble = new Bubble({ x, y, z, delta, speed })
    this.add(bubble)
    this._bubbles.push(bubble)
  }

  tick({ delta, speed, events }) {
    const bubbles = []
    const count = this._bubbles.length
    while (this._bubbles.length > 0) {
      const bubble = this._bubbles.pop()
      if (!bubble.tick({ delta, speed, count })) {
        this.remove(bubble)
      } else {
        bubbles.push(bubble)
      }
    }
    this._bubbles = bubbles

    const { birth } = events
    for (const civilization of birth) {
      if (this._bubbles.length >= MAX_SIGNALS) break
      this._createBubble({ delta, speed, civilization })
    }
  }
}
