import {
  BufferGeometry,
  PointsMaterial,
  Points,
  Float32BufferAttribute,
} from '../../vendor/three.js'

const isInsideSphere = ({ r, x, y, z }) => {
  return x*x + y*y + z*z < r*r
}

const getVertices = ({ count, maxX, maxY, cr, r }) => {
  const vertices = []
  for (let i = 0; i < count; i++) {
    const x = (maxX * Math.random()) * (Math.random() < 0.5 ? -1 : 1)
    const y = (maxY * Math.random()) * (Math.random() < 0.5 ? -1 : 1)
    const z = (maxX * Math.random()) * (Math.random() < 0.5 ? -1 : 1)
    if (!isInsideSphere({ r: cr, x, y, z })
      && isInsideSphere({ r, x, y, z }))
      vertices.push(x, y, z)
  }
  return vertices
}

export const createParticles = (opt = {}) => {
  const {
    count = 20000,
    size = 0.01,
    height = 0.5,
    radius = 5,
    centerRadius = 1,
    vertices = [],
    addParticles = true,
  } = opt

  const geometry = new BufferGeometry()
  const material = new PointsMaterial({ color: 'white', size })
  const maxX = radius, maxY = height / 2
  const points = addParticles ? vertices.concat(getVertices({
    count,
    maxX,
    maxY,
    cr: centerRadius,
    r: radius,
  })) : vertices
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  const particles = new Points(geometry, material)
  return particles
}
