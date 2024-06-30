import { World } from './World/World.js'
import { Controls } from './controls.js'
import initDrakeForm from './drake.js'

const main = () => {
  initDrakeForm()
  const container = document.querySelector('#scene-container')
  const world = new World({ container })
  new Controls({ world })
  world.render()
}

main()
