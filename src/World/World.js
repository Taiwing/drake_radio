import { createCamera } from './components/camera.js'
import { createScene } from './components/scene.js'
import { Galaxy } from './components/Galaxy/Galaxy.js'
import { createControls } from './systems/controls.js'
import { Renderer } from './systems/Renderer.js'
import { Resizer } from './systems/Resizer.js'
import { Loop } from './systems/Loop.js'
import { AxesHelper, CameraHelper } from './vendor/three.js'

export class World {
  constructor({ container }) {
    this._container = container
    this._camera = createCamera()
    this._scene = createScene()
    this._renderer = new Renderer()
    this._container.append(this._renderer.domElement)

    this._controls = createControls({
      camera: this._camera,
      canvas: this._renderer.domElement,
      dist: 20,
      pan: 6,
    })
    this._controls.addEventListener('change', () => this.render())
    this._renderer.updatables.push(this._controls)
    this._resizer = new Resizer({
      container: this._container,
      camera: this._camera,
      renderer: this._renderer,
    })
    this._resizer.onResize = () => this.render()
    this._loop = new Loop({
      camera: this._camera,
      scene: this._scene,
      renderer: this._renderer,
    })

    this._galaxy = new Galaxy()
    this._loop.updatables.push(this._galaxy)
    this._scene.add(this._galaxy)

    //TEMP
    const axesHelper = new AxesHelper(3)
    this._scene.add(axesHelper)
    /*
    setInterval(() => {
      const { x, y, z } = this._controls.target
      console.log({ target: { x, y, z }})
    }, 1000)
    */
    /*
    const cameraHelper = new CameraHelper(this._camera)
    this._scene.add(cameraHelper)
    */
    //TEMP
  }

  render() {
    this._renderer._render(this._scene, this._camera)
  }

  start() {
    this._loop.start()
  }

  stop() {
    this._loop.stop()
  }
}
