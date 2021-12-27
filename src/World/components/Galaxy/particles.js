import {
  BufferGeometry,
  PointsMaterial,
  Points,
  Float32BufferAttribute,
} from '../../vendor/three.js'

const isInsideSphere = ({ r, x, y, z }) => {
  return x*x + y*y + z*z < r*r
}

export const createParticles = (opt = {}) => {
  const {
    particleCount = 20000,
    particleSize = 0.01,
    height = 0.5,
    radius = 5,
    centerRadius = 1,
  } = opt

  const geometry = new BufferGeometry()
  const material = new PointsMaterial({
    color: 'white',
    size: particleSize,
  })
  const maxX = radius, maxY = height / 2
  const vertices = []
  for (let i = 0; i < particleCount; i++) {
    const x = (maxX * Math.random()) * (Math.random() < 0.5 ? -1 : 1)
    const y = (maxY * Math.random()) * (Math.random() < 0.5 ? -1 : 1)
    const z = (maxX * Math.random()) * (Math.random() < 0.5 ? -1 : 1)
    if (!isInsideSphere({ r: centerRadius, x, y, z })
      && isInsideSphere({ r: radius, x, y, z }))
      vertices.push(x, y, z)
  }
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  const particles = new Points(geometry, material)
  return particles
}
