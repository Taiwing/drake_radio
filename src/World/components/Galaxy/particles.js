import {
  BufferGeometry,
  PointsMaterial,
  Points,
  Float32BufferAttribute,
} from '../../vendor/three.js'

const isInsideSphere = ({ r, x, y, z }) => {
  return x*x + y*y + z*z < r*r
}

const getVertices = ({ count, maxY, cr, r }) => {
  const maxX = r
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
    r = 5,
    cr = 1,
    vertices = [],
    addParticles = true,
  } = opt

  const geometry = new BufferGeometry()
  const material = new PointsMaterial({ color: 'white', size })
  const maxY = height / 2
  let points = vertices
  if (addParticles) {
    //const global = getVertices({ count, maxY: r * 2, cr, r: r * 2 })
    const disk = getVertices({ count, maxY, cr, r })
    const center = getVertices({ count, maxY: cr * 2/3, cr: cr * 2/3, r: cr })
    //points = vertices.concat(global, disk, center)
    points = vertices.concat(disk, center)
  }
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  const particles = new Points(geometry, material)
  return particles
}
