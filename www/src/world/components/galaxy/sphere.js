export const randomSpherePoint = ({ origin, radius = 1, inside = false }) => {
  const y = Math.random() * 2 - 1
  const r = Math.sqrt(1 - y * y)
  const longitude = Math.random() * 2 * Math.PI

  const point = {
    x: radius * r * Math.sin(longitude),
    y: radius * y,
    z: radius * r * Math.cos(longitude),
  }
  if (inside) {
    const randomInsideRadius = Math.pow(Math.random(), 1/3)
    point.x *= randomInsideRadius
    point.y *= randomInsideRadius
    point.z *= randomInsideRadius
  }
  if (origin) {
    point.x += origin.x
    point.y += origin.y
    point.z += origin.z
  }

  return point
}

export const spherePoints = ({
  count,
  radius,
  origin,
  inside = false,
}) => {
  const points = []
  while (points.length < count) {
    points.push(randomSpherePoint({ origin, radius, inside }))
  }
  return points
}
