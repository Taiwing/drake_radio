import { CustomDialog } from './custom-dialog.js'
import {
  loadStoredPresets,
  configDefaults,
  presets,
} from './simulation/config.js'

const PresetLineHTML = `
  <input type="text" required />
  <button type="button" title="Up">
    <i class="fa-solid fa-caret-up"></i>
  </button>
  <button type="button" title="Down">
    <i class="fa-solid fa-caret-down"></i>
  </button>
  <button type="button" title="Remove">
	  <i class="fa-solid fa-trash"></i>
  </button>
  <input type="radio" name="default" title="Default" />
`

const moveUp = (element) => {
  const previous = element.previousElementSibling
  if (previous) {
    previous.before(element)
  }
}

const moveDown = (element) => {
  const next = element.nextElementSibling
  if (next) {
    next.after(element)
  }
}

const PresetsDialogHTML = `
  <h3>Presets</h3>
  <form id="presets-form" method="dialog"></form>
  <div class="button-line">
    <input form="presets-form" type="submit" value="Save" />
    <input form="presets-form" type="reset" value="Cancel" />
  </div>
`

class PresetsDialog extends CustomDialog {
  constructor() {
    super()
    this.innerHTML = PresetsDialogHTML
  }

  setup({ presetsButton }) {
    this._form = this.querySelector('form')
    presetsButton.addEventListener('click', () => this._open())
    this._form.addEventListener('click', (e) => this._onClick(e))
    this.addEventListener('reset', (e) => this._reset(e))
    this.addEventListener('submit', (e) => this._submit(e))
  }

  _open() {
    this._form.innerHTML = ''
    const def = configDefaults['preset']
    for (const preset in presets) {
      const line = document.createElement('div')
      line.innerHTML = PresetLineHTML
      this._form.append(line)
      line.querySelector('input[type="text"]').value = preset
      line.querySelector('input[type="radio"]').checked = def === preset
      line['data-preset'] = preset
    }
    this.showModal()
  }

  _onClick({ target }) {
    if (target.tagName !== 'BUTTON') {
      target = target.closest('button')
      if (!target) return
    }
    const line = target.closest('div')
    switch (target.title) {
      case 'Up':
        moveUp(line)
        break
      case 'Down':
        moveDown(line)
        break
      case 'Remove':
        const sibling = line.previousElementSibling || line.nextElementSibling
        if (!sibling) return
        if (line.querySelector('input[type="radio"]').checked) {
          sibling.querySelector('input[type="radio"]').checked = true
        }
        line.remove()
        break
    }
  }

  _savePresets() {
    const presetMap = {}
    const newPresets = {}
    for (const line of this._form.children) {
      const oldName = line['data-preset']
      const newName = line.querySelector('input').value
      presetMap[oldName] = newName
      newPresets[newName] = presets[oldName]
    }
    localStorage.setItem('presets', JSON.stringify(newPresets))
    loadStoredPresets()
    return presetMap
  }

  _saveDefault() {
    const newDefault = this._form.querySelector('input[type="radio"]:checked')
    const div = newDefault.closest('div')
    const preset = div.querySelector('input[type="text"]').value
    configDefaults['preset'] = preset
    localStorage.setItem('configDefaults', JSON.stringify(configDefaults))
  }

  _submit(e) {
    e.stopPropagation()
    e.preventDefault()
    const presetMap = this._savePresets()
    this._saveDefault()
    this.onSubmit(presetMap)
    this.close()
  }

  _reset(e) {
    e.stopPropagation()
    this.close()
  }

  onSubmit() {}
}

customElements.define('presets-dialog', PresetsDialog, { extends: 'dialog' })
