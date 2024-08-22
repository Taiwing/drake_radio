import {
  Line,
  Group,
  BufferGeometry,
  LineBasicMaterial,
  Float32BufferAttribute,
  SphereGeometry,
  WireframeGeometry,
  LineSegments,
  CircleGeometry,
  MeshBasicMaterial,
  Mesh,
} from '../vendor/three.js'
import { VISUAL_LIGHT_YEAR } from '../constants.js'
import { galaxySpec } from '../../simulation/constants.js'
import { config } from '../../simulation/config.js'

// Create a circle geometry
const createCircle = (radius, color, segments = 64) => {
  const geometry = new BufferGeometry()
  const vertices = []

  for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      vertices.push(radius * Math.cos(theta), radius * Math.sin(theta), 0)
  }

  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  const material = new LineBasicMaterial({ color })
  const circle = new Line(geometry, material)
  return circle
}

// Create a sphere geometry
const createSphere = (radius, color, segments = 32) => {
  const sphereGeometry = new SphereGeometry(radius, segments, segments)
  const geometry = new WireframeGeometry(sphereGeometry)
  const material = new LineBasicMaterial({ color })
  const sphere = new LineSegments(geometry, material)
  return sphere
}

// Create a hitbox geometry for raycasting
const createHitbox = (radius, segments = 64) => {
  const geometry = new CircleGeometry(radius, segments)
  const material = new MeshBasicMaterial({ visible: false })
  const hitbox = new Mesh(geometry, material)
  hitbox.isHitbox = true
  return hitbox
}

export class Bubble extends Group {
  static camera = null

  constructor({ origin, dto, count, scale, color }) {
    super()

    this._hitbox = createHitbox(VISUAL_LIGHT_YEAR)
    this.add(this._hitbox)
    this._toggleShape(color)
    this.scale.x = scale
    this.scale.y = scale
    this.scale.z = scale
    this.position.set(
      origin.x * VISUAL_LIGHT_YEAR,
      origin.y * VISUAL_LIGHT_YEAR,
      origin.z * VISUAL_LIGHT_YEAR
    )
    this._radiusMax = dto + galaxySpec.TOTAL_RADIUS * this._reduction(count+1)
  }

  get material() {
    return this.children[1].material
  }

  get _radiusMiddle() {
    return this._radiusMax / 2
  }

  _toggleShape(color = this.material.color.getHex()) {
    if (this.children.length > 1) {
      this.remove(this.children[1])
    }

    if (!this._isCircle) {
      const circle = createCircle(VISUAL_LIGHT_YEAR, color)
      this.add(circle)
    } else {
      const sphere = createSphere(VISUAL_LIGHT_YEAR, color)
      this.add(sphere)
    }

    this._isCircle = !this._isCircle
  }

  _reduction(x) {
    return Math.pow(1/x, 1/2)
  }

  onHover() {
    this._hovering = true
    if (this._isCircle) {
      this._toggleShape()
    }
  }

  onUnhover() {
    if (!this._hovering && !this._isCircle) {
      this._toggleShape()
    }
    this._hovering = false
  }

  cameraTick() {
    this.children[0].lookAt(Bubble.camera.position)
    if (this._isCircle) {
      this.children[1].lookAt(Bubble.camera.position)
    }
  }

  tick({ elapsed, count }) {
    const decay = this._reduction(count)

    // Make the sphere grow as per the simulation parameters
    if (this.scale.x < this._radiusMax * decay) {
      this.scale.x += elapsed
      this.scale.y += elapsed
      this.scale.z += elapsed
    }

    // Pop the bubble if it reached its maximum size
    if (this.scale.x >= this._radiusMax * decay) {
      return false
    }

    this.cameraTick()

    return true
  }
}

export class Signals extends Group {
  constructor({ camera, type }) {
    super()
    this._color = config[`${type}-signals-color`]
    this._count = config[`${type}-signals-count`]
    this._type = type
    Bubble.camera = camera
  }

  _createBubble({ elapsed, civ }) {
    const bubble = new Bubble({
      origin: civ.coord,
      dto: civ.distanceToOrigin,
      count: this.children.length,
      scale: elapsed,
      color: this._color,
    })
    this.add(bubble)
  }

  _inflateBubbles({ elapsed }) {
    const { length } = this.children
    for (let i = length - 1; i >= 0; i--) {
      const bubble = this.children[i]
      if (!bubble.tick({ elapsed, count: this.children.length })) {
        this.remove(bubble)
      }
    }
  }

  _handleEvent({ time, events }) {
    const civilizations = events[this._type]

    for (const civ of civilizations) {
      if (this.children.length >= this._count) break
      const elapsed = time - civ[this._type]
      this._createBubble({ elapsed, civ })
    }
  }

  tick({ time, isRunning, elapsed, events }) {
    if (config[`${this._type}-signals-count`] !== this._count) {
      this._count = config[`${this._type}-signals-count`]
      while (this.children.length > this._count) {
        this.remove(this.children[0])
      }
    }
    if (config[`${this._type}-signals-color`] !== this._color) {
      this._color = config[`${this._type}-signals-color`]
      this.children.forEach((bubble) => {
        bubble.material.color.set(this._color)
      })
    }

    if (isRunning) {
      this._inflateBubbles({ elapsed })
      this._handleEvent({ time, events })
    } else {
      this.children.forEach((bubble) => bubble.cameraTick())
    }
  }

  onMouseMove(raycaster) {
    // get all intersecting bubbles
    let intersects = raycaster.intersectObjects(this.children)
    intersects = intersects.filter(intersect => intersect.object.isHitbox)
    intersects = intersects.map(intersect => intersect.object.parent)

    // Apply hovering effect to smallest circle
    if (intersects.length > 0) {
      const intersect = intersects.reduce((prev, current) => {
        return prev.scale.x < current.scale.x ? prev : current
      })
      if (intersect) {
        intersect.onHover()
      }
    }

    // Apply unhovering effect to all other circles
    for (const bubble of this.children) {
      bubble.onUnhover()
    }
  }
}
