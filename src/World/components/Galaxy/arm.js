import { MathUtils } from '../../vendor/three.js'

const rotateY = ({ vertex, angle }) => {
  const { x, y, z } = vertex 
  return {
    x: x * Math.cos(angle) - z * Math.sin(angle),
    y,
    z: z * Math.cos(angle) + x * Math.sin(angle),
  }
}

export const createArm = ({ count, vertices, tube, line }) => {
  const sepAngle = 360 / count
  const angle = MathUtils.degToRad(360 / count)
  const newVertices = []
  for (const vertex of vertices) {
    newVertices.push(rotateY({ vertex, angle }))
  }
  return {
    vertices: newVertices,
    tube: tube ? tube.clone().rotateY(angle) : tube,
    line: line ? line.clone().rotateY(angle) : line,
  }
}
