import { spherePoints } from './sphere.js'

const involuteCurve = ({ radius, t }) => {
  const x = (Math.sin(t) - t * Math.cos(t)) * radius
  const y = 0
  const z = (Math.cos(t) + t * Math.sin(t)) * radius
  return { x, y, z }
}

// The length parameter is really hard to compute so these parameters really
// have to be adjused manually. That's not a big deal since they should never
// change anyway. However to parameterize this for the user (like make it
// possible for him to change galactic dimensions), a function computing the
// length stochastically should be created (the inverse function is just not a
// solution here for the involute curve).
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
  const radiusMin = sectionRadius / 6
  for (let t = 0; t < length; t += segment) {
    const origin = involuteCurve({ radius, t })
    if (sectionRadius > radiusMin) {
      sectionRadius = width / 2 * (length - t) * 1 / reduction
      sectionRadius = sectionRadius < radiusMin ? radiusMin : sectionRadius
    }
    points.push(...spherePoints({
      count: npoints,
      radius: sectionRadius,
      origin,
    }))
  }
  return points
}
