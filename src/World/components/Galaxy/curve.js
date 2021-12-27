import {
  Curve,
  CurvePath,
  TubeGeometry,
  LineBasicMaterial,
  LineSegments,
  Vector3,
  MathUtils,
} from '../../vendor/three.js'

class CustomCurve extends Curve {
  constructor({ scale, id, y }) {
    super()
    this.scale = scale
    this._segmentId = id
    this._customCurveY = y
  }

  getPoint(t, optionalTarget = new Vector3()) {
    t += this._segmentId
    //t = t * 2
    const tz = Math.cos(t) + t * Math.sin(t)
    const tx = Math.sin(t) - t * Math.cos(t)
    const ty = this._customCurveY
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
  }
}

export const createCurve = (opt = {}) => {
  const { scale = 1, radius = 0.25, y = 0, angle = 0, color = 'blue' } = opt
  const path = new CurvePath()
  const length = 7
  for (let i = 0; i < length ; i++) {
    const segment = new CustomCurve({ scale, id: i, y })
    path.add(segment)
  }
  const geometry = new TubeGeometry(path, 80, radius, 16, false)
  geometry.rotateY(MathUtils.degToRad(angle))
  const material = new LineBasicMaterial({ color, linewidth: 2 })
  const curve = new LineSegments(geometry, material)
  return curve
}
