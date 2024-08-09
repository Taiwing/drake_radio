import { createCamera } from './components/camera.js'
import { createScene } from './components/scene.js'
import { Galaxy } from './components/galaxy.js'
import { Signals } from './components/signals.js'
import { createControls } from './systems/controls.js'
import { Renderer } from './systems/renderer.js'
import { Resizer } from './systems/resizer.js'
import { Loop } from './systems/loop.js'
import { AxesHelper, CameraHelper } from './vendor/three.js'
import { FrameRate } from './vendor/frame-rate.js'
import { config } from '../simulation/config.js'

export class World {
  constructor({ container, simulation }) {
    this._container = container
    this._cameraStartingPoint = { x: 0, y: 3.5, z: 15 }
    this._camera = createCamera(this._cameraStartingPoint)
    this._scene = createScene()
    this._renderer = new Renderer()
    this._container.append(this._renderer.domElement)
    this._frameRate = new FrameRate()
    this._container.append(this._frameRate.dom)

    this._controls = createControls({
      camera: this._camera,
      canvas: this._renderer.domElement,
      dist: 20,
      pan: 6,
    })
    this._renderer.updatables.push(this._controls)
    this._resizer = new Resizer({
      container: this._container,
      camera: this._camera,
      renderer: this._renderer,
    })
    this.reset({ simulation })

    //TODO: debug functions
    /*
    const axesHelper = new AxesHelper(3)
    this._scene.add(axesHelper)
    setInterval(() => {
      const { x, y, z } = this._controls.target
      console.log({ target: { x, y, z }})
    }, 1000)
    */
    /*
    const cameraHelper = new CameraHelper(this._camera)
    this._scene.add(cameraHelper)
    */
  }

  resetCamera() {
    const { x, y, z } = this._cameraStartingPoint
    this._camera.position.set(x, y, z)
    this._controls.target.set(0, 0, 0)
    this._controls.update()
  }

  reset({ simulation }) {
    if (this._loop) {
      this._loop.stop()
      this._scene.clear()
      this.resetCamera()
    }

    this._loop = new Loop({
      camera: this._camera,
      scene: this._scene,
      renderer: this._renderer,
      simulation,
    })

    const galaxy = new Galaxy({ stars: simulation.stars })
    this._loop.updatables.push(galaxy)
    this._scene.add(galaxy)

    if (config['live-signal']) {
      const liveSignals = new Signals({
        camera: this._camera,
        color: config['live-color'],
        eventName: 'birth',
      })
      this._loop.updatables.push(liveSignals)
      this._scene.add(liveSignals)
    }

    if (config['dead-signal']) {
      const deadSignals = new Signals({
        camera: this._camera,
        color: config['dead-color'],
        eventName: 'death',
      })
      this._loop.updatables.push(deadSignals)
      this._scene.add(deadSignals)
    }

    this._loop.updatables.push(this._frameRate)
  }

  render() {
    this._renderer._render(this._scene, this._camera)
    this._frameRate.tick()
  }

  start() {
    this.render()
    this._loop.start()
  }
}
