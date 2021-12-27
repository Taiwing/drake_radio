import {
  SphereBufferGeometry,
  SphereGeometry,
  Mesh,
  LineBasicMaterial,
  MeshBasicMaterial,
  LineSegments,
} from '../../vendor/three.js'

export const createSphere = (opt = {}) => {
  const { radius, color = 'blue' } = opt
  const geometry = new SphereGeometry(radius)
  const material = new LineBasicMaterial({ color, linewidth: 2 })
  const sphere = new LineSegments(geometry, material)
  return sphere
}
