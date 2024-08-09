import { Clock } from '../vendor/three.js'
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
    const rotation = config['rotation']
    const elapsed = config['speed'] * this._delta

    let events
    if (this._simulation.isRunning) {
      events = this._simulation.tick({ delta: this._delta })
    }

    const { time, isRunning } = this._simulation
    for (const object of this.updatables) {
      if (isRunning && rotation && object.rotation) {
        object.rotation.y += config['rotation-per-sec'] * this._delta
      }
      object.tick({ time, isRunning, elapsed, events })
    }
  }
}
