import {
  Group,
  LineSegments,
  LineBasicMaterial,
  SphereGeometry,
  WireframeGeometry,
} from '../vendor/three.js'

import { VISUAL_LIGHT_YEAR } from '../constants.js'

const MAX_OPACITY = 1
const BASE_OPACITY = MAX_OPACITY / 2
const FLICKER = 1

export class Bubble extends LineSegments {
  constructor({ x, y, z, delta, duration, speed, radiusMax }) {
    const scale = speed * delta
    const sphereGeometry = new SphereGeometry(VISUAL_LIGHT_YEAR, 32, 32)
    const geometry = new WireframeGeometry(sphereGeometry)
    const material = new LineBasicMaterial({
      color: 0x66acdc,
      transparent: true,
      opacity: BASE_OPACITY + BASE_OPACITY * Math.abs(Math.sin(delta * FLICKER)),
    })

    super(geometry, material)

    this._material = material
    this._baseOpacity = BASE_OPACITY
    this._duration = duration
    this._radiusMax = radiusMax
    this._radiusMiddle = radiusMax / 2
    this.scale.x = scale
    this.scale.y = scale
    this.scale.z = scale
    this.position.set(
      x * VISUAL_LIGHT_YEAR,
      y * VISUAL_LIGHT_YEAR,
      z * VISUAL_LIGHT_YEAR
    )

    console.log({ duration, x, y, z }) //TEST
  }

  tick({ delta, speed }) {
    // Make the sphere grow as per the simulation parameters
    const growth = speed * delta
    if (this.scale.x < this._radiusMax) {
      this.scale.x += growth
      this.scale.y += growth
      this.scale.z += growth
    }

    // Pop the bubble if it reached its maximum size and if civilization is dead
    if (this.scale.x >= this._radiusMax && this.scale.x >= this._duration) {
      return false
    }

    // Dimming the sphere when it is passed its middle life
    if (this.scale.x >= this._radiusMiddle) {
      const dim = BASE_OPACITY / (this._radiusMiddle / growth)
      this._baseOpacity -= dim
    }

    // Flickering effect
    this._material.opacity = this._baseOpacity +
      BASE_OPACITY * Math.abs(Math.sin(this.scale.x / speed * FLICKER))

    return true
  }
}

export class Signals extends Group {
  constructor({ radiusMax }) {
    super()
    this._bubbles = []
    this._radiusMax = radiusMax
  }

  _createBubble({ delta, speed, civilization }) {
    const { x, y, z } = civilization.coord
    const duration = civilization.lifetime
    const radiusMax = this._radiusMax
    const bubble = new Bubble({ x, y, z, delta, duration, speed, radiusMax })
    this.add(bubble)
    this._bubbles.push(bubble)
  }

  tick({ delta, speed, civilizations }) {
    const bubbles = []
    while (this._bubbles.length > 0) {
      const bubble = this._bubbles.pop()
      if (!bubble.tick({ delta, speed })) {
        this.remove(bubble)
      } else {
        bubbles.push(bubble)
      }
    }
    this._bubbles = bubbles

    for (const civilization of civilizations) {
      this._createBubble({ delta, speed, civilization })
    }
  }
}
