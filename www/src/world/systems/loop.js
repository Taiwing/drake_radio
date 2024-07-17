import { Clock } from '../vendor/three.js'
import { drakeSimulation } from '../../drake.js'
import { config } from '../../simulation/config.js'

export class Loop {
  constructor({ camera, scene, renderer }) {
    this._camera = camera
    this._scene = scene
    this._renderer = renderer
    this._clock = new Clock()
    this._delta = this._clock.getDelta()
    this.updatables = []
  }

  start() {
    this._delta = this._clock.getDelta()
    this._renderer.setAnimationLoop(() => {
      this._tick()
      this._renderer._render(this._scene, this._camera)
    })
  }

  stop() {
    this._renderer.setAnimationLoop(null)
  }

  _tick () {
    this._delta = this._clock.getDelta()
    const durations = drakeSimulation({ delta: this._delta })
    for (const object of this.updatables) {
      object.tick({
        delta: this._delta,
        durations,
        speed: config['speed'].current,
        rotation: config['rotation'].current,
      })
    }
  }
}
