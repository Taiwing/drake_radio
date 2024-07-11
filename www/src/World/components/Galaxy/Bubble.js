import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
} from '../../vendor/three.js'

import { VISUAL_LIGHT_YEAR } from './constants.js'

export class Bubble extends Mesh {
  constructor({ x, y, z, delta, lifetime, speed }) {
    const scale = speed * delta
    const geometry = new SphereGeometry(VISUAL_LIGHT_YEAR, 32, 32)
    const material = new MeshBasicMaterial({
      color: 0x66acdc,
      transparent: true,
      opacity: 0.75,
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

    /*
    if (this.scale.x > 5) {
      this._material.opacity -= 0.02
      if (this._material.opacity <= 0) return false
    }
    */

    return true
  }
}
