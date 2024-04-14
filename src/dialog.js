function dialogOutsideClickClose(e) {
  const rect = e.target.getBoundingClientRect()

  const clickedOutside = (
    e.clientY < rect.top || e.clientY > rect.bottom
    || e.clientX < rect.left || e.clientX > rect.right
  )

  if (clickedOutside) e.target.close()
}

class CustomDialog extends HTMLDialogElement {
  constructor() {
    super()
    this.addEventListener('click', dialogOutsideClickClose)
  }
}

customElements.define('custom-dialog', CustomDialog, { extends: 'dialog' })
