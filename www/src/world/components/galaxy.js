import {
  Group,
  SphereGeometry,
  Mesh,
  MeshBasicMaterial,
  BufferGeometry,
  PointsMaterial,
  Float32BufferAttribute,
  Points,
  Color,
  LineBasicMaterial,
  Vector3,
  Line,
} from '../vendor/three.js'
import { config } from '../../simulation/config.js'

const createGridLines = ({ color }) => {
  const linePoints = [
    [{x: -1, y: -1, z: -1}, {x: 1, y: -1, z: -1}],
    [{x: -1, y: 0, z: -1}, {x: 1, y: 0, z: -1}],
    [{x: -1, y: 1, z: -1}, {x: 1, y: 1, z: -1}],

    [{x: -1, y: -1, z: 0}, {x: 1, y: -1, z: 0}],
    [{x: -1, y: 0, z: 0}, {x: 1, y: 0, z: 0}],
    [{x: -1, y: 1, z: 0}, {x: 1, y: 1, z: 0}],

    [{x: -1, y: -1, z: 1}, {x: 1, y: -1, z: 1}],
    [{x: -1, y: 0, z: 1}, {x: 1, y: 0, z: 1}],
    [{x: -1, y: 1, z: 1}, {x: 1, y: 1, z: 1}],

    [{x: -1, y: -1, z: -1}, {x: -1, y: 1, z: -1}],
    [{x: -1, y: -1, z: 0}, {x: -1, y: 1, z: 0}],
    [{x: -1, y: -1, z: 1}, {x: -1, y: 1, z: 1}],

    [{x: 0, y: -1, z: -1}, {x: 0, y: 1, z: -1}],
    [{x: 0, y: -1, z: 0}, {x: 0, y: 1, z: 0}],
    [{x: 0, y: -1, z: 1}, {x: 0, y: 1, z: 1}],

    [{x: 1, y: -1, z: -1}, {x: 1, y: 1, z: -1}],
    [{x: 1, y: -1, z: 0}, {x: 1, y: 1, z: 0}],
    [{x: 1, y: -1, z: 1}, {x: 1, y: 1, z: 1}],

    [{x: -1, y: -1, z: -1}, {x: -1, y: -1, z: 1}],
    [{x: 0, y: -1, z: -1}, {x: 0, y: -1, z: 1}],
    [{x: 1, y: -1, z: -1}, {x: 1, y: -1, z: 1}],

    [{x: -1, y: 0, z: -1}, {x: -1, y: 0, z: 1}],
    [{x: 0, y: 0, z: -1}, {x: 0, y: 0, z: 1}],
    [{x: 1, y: 0, z: -1}, {x: 1, y: 0, z: 1}],

    [{x: -1, y: 1, z: -1}, {x: -1, y: 1, z: 1}],
    [{x: 0, y: 1, z: -1}, {x: 0, y: 1, z: 1}],
    [{x: 1, y: 1, z: -1}, {x: 1, y: 1, z: 1}],
  ]
  const cubeHalf = config['cube-side'] / 2 * config['visual-light-year']
  linePoints.forEach((l) => l.forEach((p) => {
    p.x *= cubeHalf
    p.y *= cubeHalf
    p.z *= cubeHalf
  }))
  const material = new LineBasicMaterial({ color, linewidth: 1 })
  const lines = []
  for (const line of linePoints) {
    const [start, end] = line
    const geometry = new BufferGeometry().setFromPoints([
      new Vector3(start.x, start.y, start.z),
      new Vector3(end.x, end.y, end.z),
    ])
    lines.push(new Line(geometry, material))
  }
  return lines
}

export class Galaxy extends Group {
  constructor({ stars }) {
    super()

    this._civLifeColor = new Color(config['live-color'])
    this._civDeathColor = new Color(config['dead-color'])
    this._stars = this._createParticles({ points: stars })
    this._starColors = this._stars.geometry.attributes.color
    this._starCivCount = Array(stars.length).fill(0)
    const gridLines = createGridLines({ color: 'white' })
    this.add(this._stars, ...gridLines)
  }

  _createParticles({ points, size = 0.01 }) {
    const positions = []
    const colors = []
    points.forEach((p) => {
      positions.push(
        p.x * config['visual-light-year'],
        p.y * config['visual-light-year'],
        p.z * config['visual-light-year']
      )
      colors.push(1, 1, 1)
    })
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3))
    const material = new PointsMaterial({ vertexColors: true, size })
    return new Points(geometry, material)
  }

  _changeParticleColor({ index, color }) {
    const i = index * 3
    this._starColors.array[i] = color.r
    this._starColors.array[i + 1] = color.g
    this._starColors.array[i + 2] = color.b
    this._starColors.needsUpdate = true
  }

  tick({ events }) {
    if (!events) return
    const { birth, death } = events

    for (const born of birth) {
      const { star } = born
      this._starCivCount[star] += 1
      this._changeParticleColor({ index: star, color: this._civLifeColor })
    }

    for (const dead of death) {
      const { star } = dead
      this._starCivCount[star] -= 1
      if (this._starCivCount[star] === 0) {
        this._changeParticleColor({ index: star, color: this._civDeathColor })
      }
    }
  }
}
