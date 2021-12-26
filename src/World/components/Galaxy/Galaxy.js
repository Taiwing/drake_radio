import { Group, MathUtils } from '../../vendor/three.js'
import { createSphere } from './sphere.js'

export class Galaxy extends Group {
  constructor() {
    super()
    this._center = createSphere()
    this.add(this._center)
    this._rotationPerSec = MathUtils.degToRad(10)
  }

  tick({ delta }) {
    this.rotation.x += this._rotationPerSec * delta
  }
}
