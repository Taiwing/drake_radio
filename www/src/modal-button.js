const ModalButtonTemplate = document.createElement('template')
ModalButtonTemplate.innerHTML = `
  <slot name="button" id="button" style="cursor: pointer"></slot>
  <dialog is="custom-dialog">
    <slot name="modal" id="modal"></slot>
  </dialog>
`

class ModalButton extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.append(ModalButtonTemplate.content.cloneNode(true))

    const dialog = this.shadowRoot.querySelector('dialog')
    const button = this.shadowRoot.querySelector('#button')
    button.addEventListener('click', () => {
      dialog.showModal()
      const time = this.getAttribute('data-time')
      if (time) {
        this.closeTimeout = setTimeout(() => dialog.close(), time)
      }
    })
    dialog.addEventListener('close', () => {
      clearTimeout(this.closeTimeout)
      this.closeTimeout = undefined
    })
  }
}

customElements.define('modal-button', ModalButton)
