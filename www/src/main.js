import { World } from './world/world.js'
import { Simulation } from './simulation/index.js'
import { galaxySpec } from './simulation/constants.js'
import { initConfig } from './simulation/config.js'
import { setupDrakeDialog } from './drake-form.js'

const main = () => {
  initConfig()
  const simulation = new Simulation()
  const container = document.querySelector('#scene-container')
  const world = new World({ container, simulation, galaxySpec })
  world.start()
  window.addEventListener('DOMContentLoaded', () => {
    const statsPanel = document.querySelector('stats-panel')
    const controlPanel = document.querySelector('control-panel')
    statsPanel.setup({ simulation })
    controlPanel.setup({ simulation, world, statsPanel })
    setupDrakeDialog({ controlPanel })
  })
}

main()
