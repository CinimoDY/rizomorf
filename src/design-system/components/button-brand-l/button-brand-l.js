class ButtonBrandL extends HTMLElement {
  constructor() {
    super();
    this.isLoading = false;
  }

  static get observedAttributes() {
    return ['disabled', 'loading'];
  }

  connectedCallback() {
    // Create button element
    this.button = document.createElement('button');
    this.button.className = 'button-brand-l';
    
    // Create icon container
    const iconContainer = document.createElement('div');
    iconContainer.className = 'button-brand-l__icon';
    
    // Create icon inner element
    const iconInner = document.createElement('div');
    iconInner.className = 'button-brand-l__icon-inner';
    
    // Assemble icon structure
    iconContainer.appendChild(iconInner);
    
    // Create text container
    const textContainer = document.createElement('div');
    textContainer.className = 'button-brand-l__text';
    textContainer.textContent = this.textContent || 'Button label';
    
    // Assemble button
    this.button.appendChild(iconContainer);
    this.button.appendChild(textContainer);
    
    // Copy attributes from custom element to button
    Array.from(this.attributes).forEach(attr => {
      if (!['variant'].includes(attr.name)) {
        this.button.setAttribute(attr.name, attr.value);
      }
    });
    
    // Clear and append
    this.innerHTML = '';
    this.appendChild(this.button);
    
    // Add click handler
    this.button.addEventListener('click', this.handleClick.bind(this));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.button) return;
    
    if (name === 'disabled') {
      this.button.disabled = newValue !== null;
    } else if (name === 'loading') {
      this.isLoading = newValue !== null;
      this.button.classList.toggle('button-brand-l--loading', this.isLoading);
      this.button.disabled = this.isLoading;
    }
  }

  handleClick(event) {
    // Prevent click when loading
    if (this.isLoading) {
      event.preventDefault();
      return;
    }
    
    // Dispatch custom event
    this.dispatchEvent(new CustomEvent('button-click', {
      bubbles: true,
      cancelable: true,
      detail: { originalEvent: event }
    }));
  }
}

// Register custom element
customElements.define('button-brand-l', ButtonBrandL); 