import { Group, MathUtils } from '../../vendor/three.js'
import { createSphere } from './sphere.js'
import { createParticles } from './particles.js'

export class Galaxy extends Group {
  constructor() {
    super()
    this._center = createSphere()
    this._stars = createParticles()
    this.add(this._center, this._stars)
    this._rotationPerSec = MathUtils.degToRad(10)
  }

  tick({ delta }) {
    this.rotation.y += this._rotationPerSec * delta
  }
}
