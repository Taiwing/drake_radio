import { World } from './world/world.js'
import { Controls } from './controls.js'
import { Simulation } from './simulation/index.js'
import { galaxySpec } from './simulation/constants.js'
import { setupDrakeConfig, setupDrakeDialog } from './drake-form.js'

const main = () => {
  setupDrakeConfig()
  const simulation = new Simulation()
  const container = document.querySelector('#scene-container')
  const world = new World({ container, simulation, galaxySpec })
  const controls = new Controls({ world })
  setupDrakeDialog({ controls })
  world.render()
}

main()
