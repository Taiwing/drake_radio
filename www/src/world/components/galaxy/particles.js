import {
  BufferGeometry,
  PointsMaterial,
  Points,
  Float32BufferAttribute,
} from '../../vendor/three.js'

const isInsideSphere = ({ r, x, y, z }) => {
  return x*x + y*y + z*z < r*r
}

const randomSpherePoint = ({ origin, radius = 1, inside = false }) => {
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

const diskPoints = ({ count, yMax, r }) => {
  const points = []
  while (points.length < count) {
    const point = randomSpherePoint({ radius: r, inside: true })
    if (Math.abs(point.y) <= yMax) points.push(point)
  }
  return points
}

export const createParticles = (opt = {}) => {
  const {
   count = 20000,
    size = 0.01,
    height = 0.5,
    r = 5,
    cr = 1,
    vertices = [],
    addParticles = true,
  } = opt

  const geometry = new BufferGeometry()
  const material = new PointsMaterial({ color: 'white', size })
  const yMax = height / 2
  let points = vertices
  if (addParticles) {
    const global = []
    spherePoints({ count, radius: r * 2, inside: true })
      .forEach(e => global.push(e.x, e.y, e.z))
    const disk = []
    diskPoints({ count, yMax, r }).forEach(e => disk.push(e.x, e.y, e.z))
    const center = []
    spherePoints({ count: count * 2, radius: cr * 3/4, inside: true })
      .forEach(e => center.push(e.x, e.y, e.z))
    points = vertices.concat(global, disk, center)
  }
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  const particles = new Points(geometry, material)
  return particles
}
