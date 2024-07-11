import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
} from '../../vendor/three.js'

import { VISUAL_LIGHT_YEAR, GALAXY_DIAMETER } from './constants.js'

const MIDDLE_RADIUS = GALAXY_DIAMETER / 4
const MAX_OPACITY = 0.5

export class Bubble extends Mesh {
  constructor({ x, y, z, delta, lifetime, speed }) {
    const scale = speed * delta
    const geometry = new SphereGeometry(VISUAL_LIGHT_YEAR, 32, 32)
    const material = new MeshBasicMaterial({
      color: 0x66acdc,
      transparent: true,
      opacity: MAX_OPACITY,
      side: DoubleSide,
    })

    super(geometry, material)

    this._material = material
    this.scale.x = scale
    this.scale.y = scale
    this.scale.z = scale
    this.position.set(x, y, z)
  }

  tick({ delta, speed }) {
    const growth = speed * delta
    this.scale.x += growth
    this.scale.y += growth
    this.scale.z += growth

    if (this.scale.x >= MIDDLE_RADIUS) {
      const dim = MAX_OPACITY / (MIDDLE_RADIUS / growth)
      this._material.opacity -= dim
      if (this._material.opacity <= 0) return false
    }

    return true
  }
}
