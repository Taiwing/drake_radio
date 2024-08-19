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
} from '../vendor/three.js'
import { VISUAL_LIGHT_YEAR } from '../constants.js'
import { config } from '../../simulation/config.js'

export class Galaxy extends Group {
  constructor({ stars, galaxySpec }) {
    super()

    this._spec = galaxySpec
    this._birthColorCode = config['birth-signals-color']
    this._deathColorCode = config['death-signals-color']
    this._birthColor = new Color(this._birthColorCode)
    this._deathColor = new Color(this._deathColorCode)
    this._center = this._createSphere({
      radius: this._spec.CENTER_RADIUS * 3/5 * VISUAL_LIGHT_YEAR,
    })
    this._stars = this._createParticles({ points: stars })
    this._starColors = this._stars.geometry.attributes.color
    this._starCivCount = Array(stars.length).fill(-1)
    this.add(this._center, this._stars)
  }

  _createSphere(opt = {}) {
    const { radius, color = 'white', opacity = 0.75, transparent = true } = opt
    const geometry = new SphereGeometry(radius)
    const material = new MeshBasicMaterial({ color, opacity, transparent })
    const sphere = new Mesh(geometry, material)
    return sphere
  }

  _createParticles({ points, size = 0.01 }) {
    const positions = []
    const colors = []
    points.forEach((p) => {
      positions.push(
        p.x * VISUAL_LIGHT_YEAR,
        p.y * VISUAL_LIGHT_YEAR,
        p.z * VISUAL_LIGHT_YEAR
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

  _signalColorUpdate(newBirthColor, newDeathColor) {
    if (newBirthColor) {
      this._birthColorCode = config['birth-signals-color']
      this._birthColor.set(this._birthColorCode)
    }

    if (newDeathColor) {
      this._deathColorCode = config['death-signals-color']
      this._deathColor.set(this._deathColorCode)
    }

    for (let star = 0; star < this._starCivCount.length; star++) {
      if (newBirthColor && this._starCivCount[star] > 0) {
        this._changeParticleColor({ index: star, color: this._birthColor })
      } else if (newDeathColor && this._starCivCount[star] === 0) {
        this._changeParticleColor({ index: star, color: this._deathColor })
      }
    }
  }

  tick({ events }) {
    const newBirthColor = config['birth-signals-color'] !== this._birthColorCode
    const newDeathColor = config['death-signals-color'] !== this._deathColorCode
    if (newBirthColor || newDeathColor) {
      this._signalColorUpdate(newBirthColor, newDeathColor)
    }

    if (!events) return
    const { birth, death } = events

    for (const born of birth) {
      const { star } = born
      if (this._starCivCount[star] === -1) {
        this._starCivCount[star] = 1
      } else {
        this._starCivCount[star] += 1
      }
      this._changeParticleColor({ index: star, color: this._birthColor })
    }

    for (const dead of death) {
      const { star } = dead
      this._starCivCount[star] -= 1
      if (this._starCivCount[star] === 0) {
        this._changeParticleColor({ index: star, color: this._deathColor })
      }
    }
  }
}
