import { Group, MathUtils } from '../../vendor/three.js'
import { createSphere } from './sphere.js'
import { createParticles } from './particles.js'
import { curvePoints } from './curve.js'
import { rotateY } from './rotate.js'
import { Bubble } from './bubble.js'
import {
  VISUAL_LIGHT_YEAR,
  CENTER_DIAMETER,
  GALAXY_DIAMETER,
  GALAXY_HEIGHT,
  GALAXY_ARM_COUNT,
} from './constants.js'

//TODO: future debug functions
/*
import {
  Curve,
  CurvePath,
  TubeGeometry,
  LineBasicMaterial,
  LineSegments,
  Vector3,
  Line,
  BufferGeometry,
}

class InvoluteCurve extends Curve {
  constructor({ radius, id }) {
    super()
    this._radius = radius
    this._segmentId = id
  }

  getPoint(t, optionalTarget = new Vector3()) {
    t += this._segmentId
    const { x, y, z } = involuteCurve({ t, radius: this._radius })
    return optionalTarget.set(x, y, z)
  }
}

const createTube = ({ length, radius, width, color }) => {
  const path = new CurvePath()
  for (let i = 0; i < length ; i++) {
    const segment = new InvoluteCurve({ radius, id: i })
    path.add(segment)
  }
  const geometry = new TubeGeometry(path, 80, width / 2, 16, false)
  const material = new LineBasicMaterial({ color, linewidth: 2 })
  return new LineSegments(geometry, material)
}

const createLine = ({ length, radius, width, nsections, color }) => {
  const points = []
  const segment = length / nsections
  for (let t = 0; t < length ; t += segment) {
    const point = involuteCurve({ radius, t })
    const { x, y, z } = point
    points.push(new Vector3(x, y, z))
  }
  const geometry = new BufferGeometry().setFromPoints(points)
  const material = new LineBasicMaterial({ color, linewidth: 2 })
  return new Line(geometry, material)
}
*/

export class Galaxy extends Group {
  constructor() {
    super()
    const centerRadius = CENTER_DIAMETER / 2 * VISUAL_LIGHT_YEAR
    const galacticRadius = GALAXY_DIAMETER / 2 * VISUAL_LIGHT_YEAR
    const galacticHeight = GALAXY_HEIGHT * VISUAL_LIGHT_YEAR

    this._center = createSphere({ radius: centerRadius * 3/5 })

    const arm = curvePoints({ radius: centerRadius, width: galacticHeight })
    const arms = [arm]
    const angle = MathUtils.degToRad(360 / GALAXY_ARM_COUNT)
    for (let i = 1; i < GALAXY_ARM_COUNT; i++) {
      const lastArm = arms[i - 1]
      arms.push(lastArm.map((point) => rotateY({ point, angle })))
    }

    const flatPoints = []
    for (const arm of arms) {
      for (const point of arm) {
        const { x, y, z } = point
        flatPoints.push(x, y, z)
      }
    }

    this._stars = createParticles({
      cr: centerRadius,
      r: galacticRadius,
      height: galacticHeight,
      vertices: flatPoints,
    })
    this._starPositions = this._stars.geometry.attributes.position.array
    this._starCount = this._starPositions.length / 3
    console.log({ startCount: this._starCount }) //TEST
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
