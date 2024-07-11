import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
} from '../../vendor/three.js'

export class Bubble extends Mesh {
  constructor({ x, y, z, thickness }) {
    const geometry = new SphereGeometry(0.1, 32, 32)
    const material = new MeshBasicMaterial({
      color: 0x66acdc,
      transparent: true,
      opacity: 0.75,
      side: DoubleSide,
    })

    super(geometry, material)

    this._material = material
    this.position.set(x, y, z)
  }

  tick({ delta }) {
    this.scale.x += 0.01
    this.scale.y += 0.01
    this.scale.z += 0.01

    if (this.scale.x > 5) {
      this._material.opacity -= 0.02
      if (this._material.opacity <= 0) return false
    }

    return true
  }
}
