import { Clock } from '../vendor/three.js'
import { ROTATION_PER_SEC } from '../constants.js'
import { config } from '../../simulation/config.js'

export class Loop {
  constructor({ camera, scene, renderer, simulation }) {
    this._camera = camera
    this._scene = scene
    this._renderer = renderer
    this._simulation = simulation
    this._clock = new Clock()
    this._delta = this._clock.getDelta()
    this.updatables = []
    this.on = false
  }

  start() {
    this._delta = this._clock.getDelta()
    this._renderer.setAnimationLoop(() => {
      this._tick()
      this._renderer._render(this._scene, this._camera)
    })
    this.on = true
  }

  stop() {
    this._renderer.setAnimationLoop(null)
    this.on = false
  }

  _tick () {
    this._delta = this._clock.getDelta()
    const civilizations = this._simulation.tick({ delta: this._delta })
    for (const object of this.updatables) {
      if (config['rotation'].current && object.rotation) {
        object.rotation.y += ROTATION_PER_SEC * this._delta
      }
      object.tick({
        delta: this._delta,
        speed: config['speed'].current,
        civilizations,
      })
    }
  }
}
