import { Group, MathUtils } from '../../vendor/three.js'
import { createSphere } from './sphere.js'
import { createParticles } from './particles.js'
import { createCurve } from './curve.js'

/*
** 1 unit = 20_000 light years
** center diameter: 1.4 units - 28_000 light years
** milky way diameter: 10 units - 200_000 light years
** milky way height: 0.5 units - 10_000 light years
*/

export class Galaxy extends Group {
  constructor() {
    super()
    this._armsCount = 4
    this._centerRadius = 0.70
    this._galacticRadius = 5
    this._galacticHeight = 0.5
    this._center = createSphere({ radius: this._centerRadius })
    this._arms = []
    const sepAngle = 360 / this._armsCount
    for (let i = 0; i < this._armsCount; i++) {
      const arm = createCurve({
        scale: this._centerRadius,
        y: 0,
        angle: sepAngle * i
      })
      this._arms.push(arm)
      this.add(arm)
    }
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
