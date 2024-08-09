import { World } from './world/world.js'
import { Simulation } from './simulation/index.js'

const main = () => {
  const simulation = new Simulation()
  const container = document.querySelector('#scene-container')
  const world = new World({ container, simulation })
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
