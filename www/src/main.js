import { World } from './world/world.js'
import { Controls } from './controls.js'
import { Simulation } from './simulation/index.js'
import { galaxySpec } from './simulation/constants.js'
import { initConfig } from './simulation/config.js'
import { setupDrakeDialog } from './drake-form.js'

const main = () => {
  initConfig()
  const simulation = new Simulation()
  const container = document.querySelector('#scene-container')
  const world = new World({ container, simulation, galaxySpec })
  const controls = new Controls({ simulation, world })
  setupDrakeDialog({ controls })
  world.start()
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('stats-panel').setup({ simulation })
  })
}

main()
