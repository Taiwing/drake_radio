import {
  Curve,
  CurvePath,
  TubeGeometry,
  LineBasicMaterial,
  LineSegments,
  Vector3,
  MathUtils,
  Line,
  BufferGeometry,
} from '../../vendor/three.js'

const involuteCurve = ({ radius, t }) => {
  const x = (Math.sin(t) - t * Math.cos(t)) * radius
  const y = 0
  const z = (Math.cos(t) + t * Math.sin(t)) * radius
  return { x, y, z }
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

const getSection = ({ radius, origin, npoints }) => {
  const points = []
  const vec = new Vector3()
  while (points.length < npoints) {
    vec.randomDirection().multiplyScalar(radius).add(origin)
    const { x, y, z } = vec
    points.push({ x, y, z })
  }
  return points
}

const getCurveVertices = ({ length, radius, width, nsections, npoints }) => {
  const segment = length / nsections
  const leftAngle = MathUtils.degToRad(345)
  const rightAngle = MathUtils.degToRad(15)
  const vertices = []
  const linePoints = []
  for (let t = 0; t < length; t += segment) {
    const origin = involuteCurve({ radius, t })
    linePoints.push(origin)
    vertices.push(...getSection({ radius: width / 2, origin, npoints }))
  }
  return { vertices, linePoints }
}

export const createCurve = (opt = {}) => {
  const {
    radius,
    width,
    length = 7,
    nsections = 200,
    npoints = 100,
    buildTube = false,
    buildLine = false,
    color = 'blue'
  } = opt
  const { vertices, linePoints } = getCurveVertices({
    length,
    radius,
    width,
    nsections,
    npoints,
  })
  return {
    vertices,
    tube: buildTube ? createTube({ length, radius, width, color }) : null,
    line: buildLine ? createLine({
      length,
      radius,
      width,
      color,
      nsections,
    }) : null,
  }
}
