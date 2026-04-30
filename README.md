# Day 01 — Animated OTP Input

> **Building Tiny Web Components** · Day 01

A polished, animated OTP (one-time password) input built as a native [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) — **zero dependencies**, pure HTML/CSS/JavaScript.

---

## Features

- Native `<otp-input>` custom element — works in any framework or none
- Configurable digit length via `length` attribute
- Auto-advance focus on each digit entry
- Backspace navigates to the previous field
- Non-numeric input silently ignored
- Verifying state with staggered pulse animation (simulated latency)
- Shake + red-highlight animation on error with haptic feedback on mobile
- Staggered success glow with confetti burst and rocket sound on verification
- Resend code button with 30-second cooldown timer
- Light / dark mode with system preference + manual toggle
- Mobile responsive — scales down gracefully on small screens
- `disabled` attribute to lock the entire input
- Accessible: `inputmode="numeric"`, `autocomplete="one-time-code"`, `aria-label` per digit, ARIA live regions for error and success messages

---

## Quick Start

```html
<!-- 1. Import the component (no npm, no build step) -->
<script type="module" src="otp-input.js"></script>

<!-- 2. Use it anywhere -->
<otp-input length="6" name="verification-code"></otp-input>
```

---

## Listening for Completion

```javascript
const otp = document.querySelector('otp-input');

otp.addEventListener('complete', (event) => {
  console.log(event.detail.value); // → "123456"
});
```

Event detail shape:

```js
{ value: "123456" }
```

---

## Methods

| Method | Signature | Description |
|---|---|---|
| `getValue` | `() → string` | Returns the current OTP string |
| `clear` | `() → void` | Clears all inputs and resets state |
| `focus` | `() → void` | Focuses the first input |
| `setError` | `() → void` | Triggers shake + error highlight state |
| `clearError` | `() → void` | Clears error state |

---

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `length` | `number` | `6` | Number of digit boxes |
| `name` | `string` | `otp` | Base name for input fields |
| `disabled` | `boolean` | — | Disables all inputs |

---

## Events

| Event | Detail | Fires when |
|---|---|---|
| `complete` | `{ value: string }` | All digit boxes are filled |

---

## Demo Codes

| Code | Result |
|---|---|
| `111111` | Success — confetti + rocket sound |
| anything else | Error — shake + "Invalid code" message |

---

## Running Locally

No build step required:

```bash
# Option A — Open the file directly
open index.html

# Option B — Local server (avoids ES module CORS in some browsers)
npx serve .

# Option C
python3 -m http.server 3000
```

Then visit `http://localhost:3000`.

---

## Suggested X Post Caption

> Built a fully-animated OTP input as a zero-dependency Web Component 🔐
>
> ✅ Verifying state with pulse animation
> ✅ Shake + haptic feedback on error
> ✅ Confetti + rocket sound on success
> ✅ Dark mode built-in
> ✅ Works in React, Vue, or plain HTML
>
> Just drop in `<otp-input length="6">` — no npm, no build step.
>
> Day 01 of Building Tiny Web Components 🧱
>
> [attach screenshot or screen recording]
>
> #WebComponents #JavaScript #Frontend #BuildInPublic #100DaysOfCode
