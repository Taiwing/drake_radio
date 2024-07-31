import { World } from './world/world.js'
import { Simulation } from './simulation/index.js'
import { galaxySpec } from './simulation/constants.js'
import { initConfig } from './simulation/config.js'

const main = () => {
  initConfig()
  const simulation = new Simulation()
  const container = document.querySelector('#scene-container')
  const world = new World({ container, simulation, galaxySpec })
  world.start()
  window.addEventListener('DOMContentLoaded', () => {
    const statsPanel = document.querySelector('stats-panel')
    const controlPanel = document.querySelector('control-panel')
    const settingsDialog = document.querySelector('[is="settings-dialog"]')
    const settingsButton = document.querySelector('#settings-button')
    statsPanel.setup({ simulation })
    controlPanel.setup({ simulation, world, statsPanel })
    settingsDialog.setup({ settingsButton, controlPanel })
  })
}

main()
