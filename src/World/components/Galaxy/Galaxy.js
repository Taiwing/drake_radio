import { Group, MathUtils } from '../../vendor/three.js'
import { createSphere } from './sphere.js'
import { createParticles } from './particles.js'
import { createCurve } from './curve.js'
import { createArm } from './arm.js'

/*
** 1 unit = 20_000 light years
** center diameter: 1.4 units - 28_000 light years
** milky way diameter: 10 units - 200_000 light years
** milky way height: 0.5 units - 10_000 light years
*/

export class Galaxy extends Group {
  constructor() {
    super()
    const armsCount = 4
    const centerRadius = 0.70
    const galacticRadius = 5
    const galacticHeight = 0.5

    this._center = createSphere({ radius: centerRadius })
    const arms = [createCurve({
      radius: centerRadius,
      width: galacticHeight,
    })]
    for (let i = 1; i < armsCount; i++) {
      const { vertices, tube, line } = arms[i - 1]
      const newArm = createArm({ count: armsCount, vertices, tube, line })
      arms.push(newArm)
    }
    const points = []
    for (const arm of arms) {
      const { vertices, tube, line } = arm
      if (tube) this.add(tube)
      if (line) this.add(line)
      for (const vertex of vertices) {
        const { x, y, z } = vertex
        points.push(x, y, z)
      }
    }
    this._stars = createParticles({
      centerRadius: centerRadius,
      radius: galacticRadius,
      height: galacticHeight,
      vertices: points,
    })
    this.add(this._center, this._stars)
    this._rotationPerSec = MathUtils.degToRad(10)
  }

  tick({ delta }) {
    this.rotation.y += this._rotationPerSec * delta
  }
}
