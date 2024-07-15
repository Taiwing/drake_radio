import { spherePoints } from './sphere.js'

const involuteCurve = ({ radius, t }) => {
  const x = (Math.sin(t) - t * Math.cos(t)) * radius
  const y = 0
  const z = (Math.cos(t) + t * Math.sin(t)) * radius
  return { x, y, z }
}

export const curvePoints = (opt = {}) => {
  const {
    radius,
    width,
    length = 7,
    reduction = 5,
    nsections = 500,
    npoints = 50,
  } = opt

  const segment = length / nsections
  const points = []
  let sectionRadius = width / 2
  for (let t = 0; t < length; t += segment) {
    const origin = involuteCurve({ radius, t })
    if (sectionRadius > segment * 3)
      sectionRadius = width / 2 * (length - t) * 1 / reduction
    points.push(...spherePoints({
      count: npoints,
      radius: sectionRadius,
      origin,
    }))
  }
  return points
}
