import {
  Group,
  SphereGeometry,
  Mesh,
  MeshBasicMaterial,
  BufferGeometry,
  PointsMaterial,
  Float32BufferAttribute,
  Points,
  Color,
} from '../vendor/three.js'
import { VISUAL_LIGHT_YEAR, CIV_COLOR } from '../constants.js'

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
    this._civColor = new Color(CIV_COLOR)
    this._center = this._createSphere({
      radius: this._spec.CENTER_RADIUS * 3/5 * VISUAL_LIGHT_YEAR,
    })
    this._stars = this._createParticles({ points: stars })
    this._starColors = this._stars.geometry.attributes.color
    this.add(this._center, this._stars)
  }

  _createSphere(opt = {}) {
    const { radius, color = 'white', opacity = 0.75, transparent = true } = opt
    const geometry = new SphereGeometry(radius)
    const material = new MeshBasicMaterial({ color, opacity, transparent })
    const sphere = new Mesh(geometry, material)
    return sphere
  }

  _createParticles({ points, size = 0.01 }) {
    const positions = []
    const colors = []
    points.forEach((p) => {
      positions.push(
        p.x * VISUAL_LIGHT_YEAR,
        p.y * VISUAL_LIGHT_YEAR,
        p.z * VISUAL_LIGHT_YEAR
      )
      colors.push(1, 1, 1)
    })
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    const material = new PointsMaterial({ vertexColors: true, size })
    return new Points(geometry, material)
  }

  _changeParticleColor({ index, color }) {
    const i = index * 3
    this._starColors.array[i] = color.r
    this._starColors.array[i + 1] = color.g
    this._starColors.array[i + 2] = color.b
    this._starColors.needsUpdate = true
  }

  tick({ civilizations }) {
    for (const civilization of civilizations) {
      const { star } = civilization
      this._changeParticleColor({ index: star, color: this._civColor })
    }
  }
}
