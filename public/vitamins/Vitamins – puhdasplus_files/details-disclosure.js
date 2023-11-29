/** Shopify CDN: Minification failed

Line 10:0 Transforming class syntax to the configured target environment ("es5") is not supported yet
Line 11:13 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 20:12 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 26:10 Transforming object literal extensions to the configured target environment ("es5") is not supported yet
Line 36:7 Transforming object literal extensions to the configured target environment ("es5") is not supported yet

**/
class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    })
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach(animation => animation.play());
    } else {
      this.animations.forEach(animation => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);
