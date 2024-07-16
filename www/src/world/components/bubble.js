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
    this.position.set(x, y, z)

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
