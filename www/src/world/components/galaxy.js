import {
  Group,
  MathUtils,
  SphereGeometry,
  Mesh,
  MeshBasicMaterial,
  BufferGeometry,
  PointsMaterial,
  Float32BufferAttribute,
  Points,
} from '../vendor/three.js'
import { Bubble } from './bubble.js'
import { VISUAL_LIGHT_YEAR } from '../constants.js'

//TODO: debug functions
/*
import {
  Curve,
  CurvePath,
  TubeGeometry,
  LineBasicMaterial,
  LineSegments,
  Vector3,
  Line,
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
  constructor({ stars, galaxySpec }) {
    super()

    this._spec = galaxySpec
    this._center = this._createSphere({
      radius: this._spec.CENTER_DIAMETER / 2 * 3/5 * VISUAL_LIGHT_YEAR,
    })
    this._stars = this._createParticles({ points: stars })
    this._starPositions = this._stars.geometry.attributes.position.array
    this._starCount = this._starPositions.length / 3
    console.log({ startCount: this._starCount }) //TEST
    this.add(this._center, this._stars)
    this._rotationPerSec = MathUtils.degToRad(10)
    this._bubbles = []
  }

  _createSphere(opt = {}) {
    const { radius, color = 'white', opacity = 0.75, transparent = true } = opt
    const geometry = new SphereGeometry(radius)
    const material = new MeshBasicMaterial({ color, opacity, transparent })
    const sphere = new Mesh(geometry, material)
    return sphere
  }

  _createParticles({ points, size = 0.01 }) {
    const geometry = new BufferGeometry()
    const material = new PointsMaterial({ color: 'white', size })
    const particles = []
    points.forEach(p => particles.push(
      p.x * VISUAL_LIGHT_YEAR,
      p.y * VISUAL_LIGHT_YEAR,
      p.z * VISUAL_LIGHT_YEAR
    ))
    geometry.setAttribute('position', new Float32BufferAttribute(particles, 3))
    return new Points(geometry, material)
  }

  _createBubble({ delta, duration, speed, radiusMax }) {
    const randomStar = Math.floor(Math.random() * this._starCount)
    const index = randomStar * 3
    const x = this._starPositions[index]
    const y = this._starPositions[index + 1]
    const z = this._starPositions[index + 2]
    const bubble = new Bubble({ x, y, z, delta, duration, speed, radiusMax })
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
      this._createBubble({
        delta,
        duration,
        speed,
        radiusMax: this._spec.DIAMETER / 2,
      })
    }
  }
}
