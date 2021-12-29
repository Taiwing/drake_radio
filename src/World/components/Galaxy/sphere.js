import {
  SphereBufferGeometry,
  SphereGeometry,
  Mesh,
  LineBasicMaterial,
  MeshBasicMaterial,
  LineSegments,
} from '../../vendor/three.js'

export const createSphere = (opt = {}) => {
  const { radius, color = 'white', opacity = 0.75, transparent = true } = opt
  const geometry = new SphereGeometry(radius)
  const material = new MeshBasicMaterial({ color, opacity, transparent })
  const sphere = new Mesh(geometry, material)
  return sphere
}
