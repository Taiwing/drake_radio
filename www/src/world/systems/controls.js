import { OrbitControls } from '../vendor/orbit-controls.js'

export const createControls = ({ camera, canvas, dist, pan }) => {
  const controls = new OrbitControls(camera, canvas)
  controls.screenSpacePanning = false
  controls.maxDistance = dist
  controls.onRender = () => {
    const { x, z } = controls.target
    if (x > pan) controls.target.setX(pan)
    else if (x < -pan) controls.target.setX(-pan)
    if (z > pan) controls.target.setZ(pan)
    else if (z < -pan) controls.target.setZ(-pan)
  }
  return controls
}
