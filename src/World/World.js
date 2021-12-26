import { createCamera } from './components/camera.js'
import { createScene } from './components/scene.js'
import { createLights } from './components/lights.js' //TODO: move this to Galaxy
import { Galaxy } from './components/Galaxy/Galaxy.js'
import { createControls } from './systems/controls.js'
import { createRenderer } from './systems/renderer.js'
import { Resizer } from './systems/Resizer.js'
import { Loop } from './systems/Loop.js'
import { AxesHelper } from './vendor/three.js'

export class World {
  constructor({ container }) {
    this._container = container
    this._camera = createCamera()
    this._scene = createScene()
    this._renderer = createRenderer()
    this._container.append(this._renderer.domElement)

    this._controls = createControls({
      camera: this._camera,
      canvas: this._renderer.domElement,
    })
    this._controls.addEventListener('change', () => this.render())
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
    const light = createLights()
    this._loop.updatables.push(this._controls)
    this._loop.updatables.push(this._galaxy)
    this._scene.add(this._galaxy, light)

    //TEMP
    const axesHelper = new AxesHelper(3)
    this._scene.add(axesHelper)
    //TEMP
  }

  render() {
    this._renderer.render(this._scene, this._camera)
  }

  start() {
    this._loop.start()
  }

  stop() {
    this._loop.stop()
  }
}
