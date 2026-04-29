# Day 01 — Animated OTP Input

> **Building Tiny Web Components** · Day 01

A polished, animated OTP (one-time password) input built as a native [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) — **zero dependencies**, pure HTML/CSS/JavaScript.

---

## Features

- Native `<otp-input>` custom element — works in any framework or none
- Configurable digit length via `length` attribute
- Auto-advance focus on each digit entry
- Full keyboard navigation — ArrowLeft, ArrowRight, Backspace
- Paste support — paste `123456` to fill all digits at once
- Non-numeric input silently ignored
- Staggered wave animation when all digits are entered
- Shake + red-highlight animation for errors
- Success glow state with accessible live region announcement
- `disabled` attribute to lock the entire input
- Declarative `error` attribute for server-side validation flows
- Accessible: `inputmode="numeric"`, `autocomplete="one-time-code"`, `aria-label` per digit, ARIA live regions
- Custom `complete` event with `detail.value`

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
| `setValue` | `(code: string) → void` | Programmatically fills digits |
| `clear` | `() → void` | Clears all inputs and resets state |
| `focus` | `() → void` | Focuses the first empty input |
| `setError` | `(message: string) → void` | Triggers shake + error state |
| `clearError` | `() → void` | Clears error state |

---

## Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `length` | `number` | `6` | Number of digit boxes |
| `name` | `string` | `otp` | Base name for input fields |
| `disabled` | `boolean` | — | Disables all inputs |
| `error` | `string` | — | Sets error state declaratively |

---

## Events

| Event | Detail | Fires when |
|---|---|---|
| `complete` | `{ value: string }` | All digit boxes are filled |

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
> ✅ Paste entire code instantly
> ✅ Keyboard navigation built-in
> ✅ Staggered wave on success
> ✅ Shake animation on error
> ✅ Works in React, Vue, or plain HTML
>
> Just drop in `<otp-input length="6">` — no npm, no build step.
>
> Day 01 of Building Tiny Web Components 🧱
>
> [attach screenshot or screen recording]
>
> #WebComponents #JavaScript #Frontend #BuildInPublic #100DaysOfCode
