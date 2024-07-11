import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
} from '../../vendor/three.js'

export class Bubble extends Group {
  constructor({ x, y, z, thickness }) {
    super()

    const outerSphereGeometry = new SphereGeometry(0.1, 32, 32)
    this._outerSphereMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
      side: DoubleSide,
    })
    const outerSphere = new Mesh(outerSphereGeometry, this._outerSphereMaterial)
    this.add(outerSphere)

    const innerSphereGeometry = new SphereGeometry(0.09, 32, 32)
    this._innerSphereMaterial = new MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.5,
      side: DoubleSide,
    })
    const innerSphere = new Mesh(innerSphereGeometry, this._innerSphereMaterial)
    this.add(innerSphere)

    this.position.set(x, y, z)
  }

  tick({ delta }) {
    this.scale.x += 0.01
    this.scale.y += 0.01
    this.scale.z += 0.01

    if (this.scale.x > 5) {
      this._outerSphereMaterial.opacity -= 0.02
      this._innerSphereMaterial.opacity -= 0.02

      if (this._outerSphereMaterial.opacity <= 0) return false
    }

    return true
  }
}
