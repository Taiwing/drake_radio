import { Group, MathUtils } from '../../vendor/three.js'
import { createSphere } from './sphere.js'
import { createParticles } from './particles.js'
import { createCurve } from './curve.js'
import { createArm } from './arm.js'
import { Bubble } from './bubble.js'
import {
  VISUAL_LIGHT_YEAR,
  CENTER_DIAMETER,
  GALAXY_DIAMETER,
  GALAXY_HEIGHT,
} from './constants.js'

export class Galaxy extends Group {
  constructor() {
    super()
    const armsCount = 4
    const centerRadius = CENTER_DIAMETER / 2 * VISUAL_LIGHT_YEAR
    const galacticRadius = GALAXY_DIAMETER / 2 * VISUAL_LIGHT_YEAR
    const galacticHeight = GALAXY_HEIGHT * VISUAL_LIGHT_YEAR

    this._center = createSphere({ radius: centerRadius * 3/5 })
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
      cr: centerRadius,
      r: galacticRadius,
      height: galacticHeight,
      vertices: points,
    })
    this._starPositions = this._stars.geometry.attributes.position.array
    this._starCount = this._starPositions.length / 3
    this.add(this._center, this._stars)
    this._rotationPerSec = MathUtils.degToRad(10)
    this._bubbles = []
  }

  createBubble({ delta, duration, speed }) {
    const randomStar = Math.floor(Math.random() * this._starCount)
    const index = randomStar * 3
    const x = this._starPositions[index]
    const y = this._starPositions[index + 1]
    const z = this._starPositions[index + 2]
    const bubble = new Bubble({ x, y, z, delta, duration, speed })
    this.add(bubble)
    this._bubbles.push(bubble)
  }

  tick({ delta, durations, speed, rotation }) {
    if (rotation) this.rotation.y += this._rotationPerSec * delta

    const bubbles = []
    while (this._bubbles.length > 0) {
      const bubble = this._bubbles.pop()
      if (!bubble.tick({ delta, speed })) {
        this.remove(bubble)
      } else {
        bubbles.push(bubble)
      }
    }
    this._bubbles = bubbles

    for (const duration of durations) {
      this.createBubble({ delta, duration, speed })
    }
  }
}
