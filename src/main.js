const SERVER_IP = 'malangacraft.dot0x.com'
const TOAST_DURATION = 2200
/** API que consulta el puerto por defecto de Minecraft (25565) con el protocolo Server List Ping */
const STATUS_API = 'https://api.mcstatus.io/v2/status/java'

/**
 * Copia la IP del servidor al portapapeles y muestra un toast.
 */
export function copyIP() {
  navigator.clipboard.writeText(SERVER_IP)
    .then(() => showToast())
    .catch(() => fallbackCopy())
}

function showToast() {
  const toast = document.getElementById('toast')
  if (!toast) return
  toast.classList.add('show')
  clearTimeout(showToast._tid)
  showToast._tid = setTimeout(() => toast.classList.remove('show'), TOAST_DURATION)
}

function fallbackCopy() {
  window.prompt('Copy this IP:', SERVER_IP)
}

/**
 * Obtiene el estado del servidor consultando el puerto 25565 (protocolo Minecraft).
 * Usa mcstatus.io, que hace Server List Ping al puerto por defecto.
 */
async function fetchServerStatus() {
  const loading = document.getElementById('status-loading')
  const content = document.getElementById('status-content')
  const errorEl = document.getElementById('status-error')
  const statusText = document.getElementById('status-text')
  const statusDot = document.getElementById('status-dot')
  const iconEl = document.getElementById('server-icon')
  const motdEl = document.getElementById('server-motd')
  const playersEl = document.getElementById('server-players')

  if (!loading || !content || !errorEl) return

  try {
    const res = await fetch(`${STATUS_API}/${encodeURIComponent(SERVER_IP)}`)
    if (!res.ok) throw new Error('API error')
    const data = await res.json()

    loading.hidden = true
    errorEl.hidden = true
    content.hidden = false

    if (data.online) {
      statusDot.classList.add('online')
      statusText.textContent = 'Online'

      if (data.icon) {
        iconEl.src = data.icon.startsWith('data:') ? data.icon : `data:image/png;base64,${data.icon}`
        iconEl.hidden = false
      } else {
        iconEl.hidden = true
      }

      const clean = data.motd?.clean
      if (clean != null && String(clean).trim()) {
        motdEl.textContent = (Array.isArray(clean) ? clean.join(' ') : String(clean)).replace(/\n/g, ' ').trim()
        motdEl.hidden = false
      } else {
        motdEl.hidden = true
      }

      if (playersEl && data.players != null && typeof data.players.online === 'number') {
        const max = data.players.max ?? '?'
        playersEl.textContent = `${data.players.online} / ${max} players`
        playersEl.hidden = false
      } else if (playersEl) {
        playersEl.hidden = true
      }
    } else {
      statusDot.classList.remove('online')
      statusText.textContent = 'Offline'
      iconEl.hidden = true
      motdEl.textContent = ''
      motdEl.hidden = true
      if (playersEl) {
        playersEl.textContent = ''
        playersEl.hidden = true
      }
    }
  } catch {
    loading.hidden = true
    content.hidden = true
    errorEl.hidden = false
  }
}

function init() {
  const btn = document.querySelector('[data-copy-ip]')
  if (btn) btn.addEventListener('click', copyIP)
  fetchServerStatus()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
