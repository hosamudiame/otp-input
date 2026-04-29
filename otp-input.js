/**
 * <otp-input> — Animated OTP Input Web Component
 */

const SHADOW_CSS = `
  :host {
    display: block;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .root {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .inputs {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  /* ── Box Wrapper ─────────────────────────────────────── */
  .box-wrapper {
    position: relative;
    width: 60px;
    height: 72px;
    border-radius: 14px;
    background: var(--color-surface-input);
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .box-bg {
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: 14px;
    box-shadow: var(--color-border) 0px 0px 0px 1px inset;
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }

  .box {
    position: absolute;
    inset: 0;
    z-index: 5;
    box-sizing: border-box; /* required: global reset doesn't reach shadow DOM */
    border: none;
    outline: none;
    background: transparent;
    -webkit-appearance: none; /* Safari: strips UA textfield styling that misaligns text */
    appearance: none;
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 28px;
    font-weight: 600;
    line-height: 72px; /* vertically centers text within the 72px wrapper */
    text-align: center;
    color: var(--color-text);
    letter-spacing: -0.5px;
    caret-color: transparent;
    cursor: text;
    padding: 0;
  }

  .box-placeholder {
    position: absolute;
    inset: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 600;
    color: var(--color-placeholder);
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  /* States */
  .box-wrapper:focus-within {
    transform: scale(1.05);
    z-index: 20;
  }

  .box-wrapper:focus-within .box-bg {
    background: var(--color-surface-raised);
    box-shadow:
      0 0 0 1.5px var(--color-focus-ring),
      0 10px 15px -3px rgba(0, 0, 0, 0.06),
      0 4px 6px -2px rgba(0, 0, 0, 0.03);
  }

  /* ── Verifying State ───────────────────────────────────── */
  :host(.verifying) .box {
    opacity: 0.5;
  }

  :host(.verifying) .box-bg {
    animation: verifyingPulse 1.2s ease-in-out infinite calc(var(--i) * 0.1s);
  }

  @keyframes verifyingPulse {
    0%, 100% { background: var(--color-surface-input); transform: scale(1); }
    50% { background: var(--color-surface-raised); transform: scale(0.98); }
  }

  .box.filled ~ .box-placeholder {
    opacity: 0;
  }

  .box.filled ~ .box-bg {
    background: var(--color-filled-bg);
    box-shadow:
      rgba(14, 18, 27, 0.04) 0px 3px 6px,
      rgba(14, 18, 27, 0.02) 0px 1px 2px,
      var(--color-filled-ring) 0px 0px 0px 1px;
  }

  /* Success */
  :host(.success) .box {
    color: var(--color-success-text);
    animation: successPulse 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) calc(var(--i, 0) * 40ms) both;
    transform-origin: center;
  }
  :host(.success) .box-bg {
    background: var(--color-success-bg);
    box-shadow: var(--color-success-ring) 0px 0px 0px 1.5px inset;
  }

  @keyframes successPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }

  /* Error */
  :host(.error) .box { color: #dc2626; }
  :host(.error) .box-bg {
    background: var(--color-error-bg);
    box-shadow: var(--color-error-ring) 0px 0px 0px 1.5px inset;
  }
  :host(.shake) .inputs { animation: hapticShake 0.4s ease both; }

  @keyframes hapticShake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(2px); }
  }
`;

class OtpInput extends HTMLElement {
  static get observedAttributes() { return ['length', 'disabled', 'name']; }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._inputs = [];
    this._length = 6;
  }

  connectedCallback() { this._build(); }

  _build() {
    this._length = Math.max(1, parseInt(this.getAttribute('length')) || 6);
    const base = this.getAttribute('name') || 'otp';

    const boxHTML = Array.from({ length: this._length }, (_, i) => `
      <div class="box-wrapper" style="--i:${i}">
        <input type="text" class="box" inputmode="numeric" maxlength="1" data-idx="${i}" style="--i:${i}" />
        <div class="box-bg"></div>
        <div class="box-placeholder">0</div>
      </div>
    `).join('');

    this.shadowRoot.innerHTML = `<style>${SHADOW_CSS}</style><div class="root"><div class="inputs">${boxHTML}</div></div>`;
    this._inputs = [...this.shadowRoot.querySelectorAll('.box')];
    this._wire();
  }

  _wire() {
    this._inputs.forEach((el, idx) => {
      el.addEventListener('keydown', (e) => this._onKeydown(e, idx));
      el.addEventListener('input', (e) => this._onInput(e, idx));
      el.addEventListener('focus', () => el.select());
    });
  }

  _onKeydown(e, idx) {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (this._inputs[idx].value) {
        this._inputs[idx].value = '';
        this._setFilled(idx, false);
      } else if (idx > 0) {
        this._inputs[idx - 1].value = '';
        this._setFilled(idx - 1, false);
        this._inputs[idx - 1].focus();
      }
      this._evaluate();
      return;
    }
    if (!/^[0-9]$/.test(e.key) && e.key !== 'Tab') e.preventDefault();
  }

  _onInput(e, idx) {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    e.target.value = val;
    this._setFilled(idx, !!val);
    if (val) this._inputs[idx + 1]?.focus();
    this.clearError();
    this._evaluate();
  }

  _setFilled(idx, filled) {
    this._inputs[idx]?.classList.toggle('filled', filled);
  }

  _evaluate() {
    const value = this.getValue();
    if (value.length === this._length) {
      this.dispatchEvent(new CustomEvent('complete', { detail: { value } }));
    }
  }

  getValue() { return this._inputs.map(el => el.value).join(''); }

  clear() {
    this._inputs.forEach(el => { el.value = ''; el.classList.remove('filled'); });
    this.classList.remove('success', 'error', 'shake', 'verifying');
    if (this.offsetParent !== null) {
      this._inputs[0]?.focus();
    }
  }

  setError() {
    this.classList.remove('success', 'error', 'shake');
    void this.offsetWidth;
    this.classList.add('error', 'shake');
    
    // Haptic feedback for mobile devices (double-thump)
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }

    this.addEventListener('animationend', () => this.classList.remove('shake'), { once: true });
  }

  clearError() {
    this.classList.remove('error', 'shake');
  }

  _syncDisabled() {
    const off = this.hasAttribute('disabled');
    this._inputs.forEach(el => el.disabled = off);
  }
}

customElements.define('otp-input', OtpInput);
