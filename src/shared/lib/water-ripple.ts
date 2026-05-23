let installed = false

const RIPPLE_CLASS = 'wt-water-ripple'
const HOST_CLASS = 'wt-water-ripple-host'
const SKIP_SELECTOR = '[data-no-ripple],[data-no-ripple] *'
const TARGET_SELECTOR =
  'button, a[role="button"], [role="button"], [data-ripple], input[type="button"], input[type="submit"], input[type="reset"]'

function isDisabled(el: HTMLElement): boolean {
  if (el.matches(':disabled')) return true
  if (el.getAttribute('aria-disabled') === 'true') return true
  return false
}

function handlePointerDown(event: PointerEvent) {
  if (event.button !== 0 && event.pointerType === 'mouse') return
  const path = event.composedPath()
  let target: HTMLElement | null = null
  for (const node of path) {
    if (!(node instanceof HTMLElement)) continue
    if (node.matches(SKIP_SELECTOR)) return
    if (!target && node.matches(TARGET_SELECTOR)) target = node
  }
  if (!target || isDisabled(target)) return

  const rect = target.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  const cs = getComputedStyle(target)
  if (cs.position === 'static') target.style.position = 'relative'
  if (cs.overflow !== 'hidden') target.style.overflow = 'hidden'
  target.classList.add(HOST_CLASS)

  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const dx = Math.max(x, rect.width - x)
  const dy = Math.max(y, rect.height - y)
  const radius = Math.hypot(dx, dy)
  const size = radius * 2

  const ripple = document.createElement('span')
  ripple.className = RIPPLE_CLASS
  ripple.style.left = `${x - radius}px`
  ripple.style.top = `${y - radius}px`
  ripple.style.width = `${size}px`
  ripple.style.height = `${size}px`

  target.appendChild(ripple)

  const cleanup = () => {
    ripple.removeEventListener('animationend', cleanup)
    ripple.remove()
  }
  ripple.addEventListener('animationend', cleanup)
  window.setTimeout(cleanup, 1200)
}

export function installWaterRipple() {
  if (installed || typeof document === 'undefined') return
  installed = true
  document.addEventListener('pointerdown', handlePointerDown, { passive: true })
}
