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
    this._pointer = new Vector2()
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

    // Pointer events
    this._pointerDelta = 6
    this._pointerStartX = 0
    this._pointerStartY = 0
    this._container.addEventListener('pointermove', this._onPointerMove.bind(this))
    this._container.addEventListener('pointerdown', this._onPointerDown.bind(this))
    this._container.addEventListener('pointerup', this._onPointerUp.bind(this))
    // Uber hack to prevent interaction when the pointer is moving outside the
    // container (actually inside objects above the container)
    document.addEventListener('pointermove', this._resetPointer.bind(this))
  }

  _resetPointer() {
    this._pointer.x = -2
    this._pointer.y = -2
    this._raycaster.setFromCamera(this._pointer, this._camera)
  }

  _setPointer(event) {
    this._pointer.x = (event.clientX / window.innerWidth) * 2 - 1
    this._pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
    this._raycaster.setFromCamera(this._pointer, this._camera)
  }

  _onPointerMove(event) {
    event.stopPropagation()
    this._setPointer(event)
    Signals.onPointerMove(this._raycaster)
  }

  _onPointerDown(event) {
    this._pointerStartX = event.clientX
    this._pointerStartY = event.clientY
  }

  _onPointerUp(event) {
    // Prevent click event if the pointer moved too much (drag)
    const diffX = Math.abs(event.clientX - this._pointerStartX)
    const diffY = Math.abs(event.clientY - this._pointerStartY)
    if (diffX > this._pointerDelta || diffY > this._pointerDelta) {
      if (event.pointerType !== 'mouse') this._resetPointer()
      return
    }

    // Else, trigger click event
    this._setPointer(event)
    Signals.onClick(this._raycaster)
    if (event.pointerType !== 'mouse') this._resetPointer()
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
