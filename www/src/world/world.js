import { createCamera } from './components/camera.js'
import { createScene } from './components/scene.js'
import { Galaxy } from './components/galaxy.js'
import { Signals, Bubble } from './components/signals.js'
import { createControls } from './systems/controls.js'
import { Renderer } from './systems/renderer.js'
import { Resizer } from './systems/resizer.js'
import { Loop } from './systems/loop.js'
import { Vector2, Raycaster } from './vendor/three.js'
import { FrameRate } from './vendor/frame-rate.js'
import { config } from '../simulation/config.js'

export class World {
  constructor({ container, simulation, galaxySpec }) {
    this._container = container
    this._cameraStartingPoint = { x: 0, y: 3.5, z: 15 }
    this._camera = createCamera(this._cameraStartingPoint)
    this._scene = createScene()
    this._renderer = new Renderer()
    this._container.append(this._renderer.domElement)
    this._frameRate = new FrameRate()
    this._container.append(this._frameRate.dom)
    this._mouse = new Vector2()
    this._raycaster = new Raycaster()

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
    this.reset({ simulation, galaxySpec })

    // Uber hack to prevent interaction when the mouse is moving outside the
    // container (actually inside objects above the container)
    document.addEventListener('mousemove', (event) => {
      this._mouse.x = -2
      this._mouse.y = -2
      this._raycaster.setFromCamera(this._mouse, this._camera)
    })
    this._container.addEventListener('mousemove', this._onMouseMove.bind(this))
    this._container.addEventListener('click', this._onClick.bind(this))
  }

  _setMouse(event) {
    this._mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this._mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    this._raycaster.setFromCamera(this._mouse, this._camera)
  }

  _onMouseMove(event) {
    event.stopPropagation()
    this._setMouse(event)
    Signals.onMouseMove(this._raycaster)
  }

  _onClick(event) {
    this._setMouse(event)
    Signals.onClick(this._raycaster)
  }

  resetCamera() {
    const { x, y, z } = this._cameraStartingPoint
    this._camera.position.set(x, y, z)
    this._controls.target.set(0, 0, 0)
    this._controls.update()
  }

  reset({ simulation, galaxySpec }) {
    if (this._loop) {
      this._loop.stop()
      this._scene.clear()
      this.resetCamera()
      Signals.reset()
    }

    this._loop = new Loop({
      camera: this._camera,
      scene: this._scene,
      renderer: this._renderer,
      raycaster: this._raycaster,
      simulation,
    })

    const galaxy = new Galaxy({ stars: simulation.stars, galaxySpec })
    this._loop.updatables.push(galaxy)
    this._scene.add(galaxy)

    const birthSignals = new Signals({ camera: this._camera, type: 'birth' })
    this._loop.updatables.push(birthSignals)
    this._scene.add(birthSignals)

    const deathSignals = new Signals({ camera: this._camera, type: 'death' })
    this._loop.updatables.push(deathSignals)
    this._scene.add(deathSignals)

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
