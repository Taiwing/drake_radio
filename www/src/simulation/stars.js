import { MathUtils } from '../world/vendor/three.js'
import { galaxySpec } from './constants.js'
import { randomSpherePoint, spherePoints } from './sphere.js'
import { curvePoints } from './curve.js'

const rotateY = ({ point, angle }) => {
  const { x, y, z } = point
  return {
    x: x * Math.cos(angle) - z * Math.sin(angle),
    y,
    z: z * Math.cos(angle) + x * Math.sin(angle),
  }
}

const diskPoints = ({ count, radius, yMax }) => {
  const points = []
  while (points.length < count) {
    const point = randomSpherePoint({ radius, inside: true })
    if (Math.abs(point.y) <= yMax) points.push(point)
  }
  return points
}

export const starPoints = ({ count = 20000, centerRadius, radius, height }) => {
  let points = []

  // Galactic Center
  const center = spherePoints({
    count: count * 2,
    radius: centerRadius * 3/4,
    inside: true,
  })
  points = points.concat(center)

  // Spiraling Arms
  const arm = curvePoints({ radius: centerRadius, width: height })
  const arms = [arm]
  const angle = MathUtils.degToRad(360 / galaxySpec.ARM_COUNT)
  for (let i = 1; i < galaxySpec.ARM_COUNT; i++) {
    const lastArm = arms[i - 1]
    arms.push(lastArm.map((point) => rotateY({ point, angle })))
  }
  points = points.concat(...arms)

  // Galactic Disk
  const disk = diskPoints({ count, radius, yMax: height / 2 })
  points = points.concat(disk)

  // Global Star Cloud
  const global = spherePoints({ count, radius: radius * 2, inside: true })
  points = points.concat(global)

  return points
}
