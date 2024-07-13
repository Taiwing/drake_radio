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

const getVertices = ({ count, yMax, cr, r }) => {
  const xMax = r
  const vertices = []
  for (let i = 0; i < count; i++) {
    const x = (xMax * Math.random()) * (Math.random() < 0.5 ? -1 : 1)
    const y = (yMax * Math.random()) * (Math.random() < 0.5 ? -1 : 1)
    const z = (xMax * Math.random()) * (Math.random() < 0.5 ? -1 : 1)
    if (!isInsideSphere({ r: cr, x, y, z }) && isInsideSphere({ r, x, y, z }))
      vertices.push(x, y, z)
  }
  return vertices
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
    //const global = getVertices({ count, yMax: r * 2, cr, r: r * 2 })
    const disk = getVertices({ count, yMax, cr, r })
    const center = []
    spherePoints({ count: count * 2, radius: cr * 3/4, inside: true })
      .forEach(e => center.push(e.x, e.y, e.z))
    //points = vertices.concat(global, disk, center)
    points = vertices.concat(disk, center)
  }
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  const particles = new Points(geometry, material)
  return particles
}
