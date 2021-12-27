import { Group, MathUtils } from '../../vendor/three.js'
import { createSphere } from './sphere.js'
import { createParticles } from './particles.js'

/*
** 1 unit = 20_000 light years
** center diameter: 2 units - 40_000 light years
** milky way diameter: 10 units - 200_000 light years
** milky way height: 0.5 units - 10_000 light years
*/

export class Galaxy extends Group {
  constructor() {
    super()
    this._centerRadius = 1
    this._galacticRadius = 5
    this._galacticHeight = 0.5
    this._center = createSphere({ radius: this._centerRadius })
    this._stars = createParticles({
      centerRadius: this._centerRadius,
      radius: this._galacticRadius,
      height: this._galacticHeight,
    })
    this.add(this._center, this._stars)
    this._rotationPerSec = MathUtils.degToRad(10)
  }

  tick({ delta }) {
    this.rotation.y += this._rotationPerSec * delta
  }
}
