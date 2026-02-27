const SERVER_IP = 'malangacraft.dot0x.com'
const TOAST_DURATION = 2200

const STATUS_APIS = [
  `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(SERVER_IP)}`,
  `https://api.mcsrvstat.us/2/${encodeURIComponent(SERVER_IP)}`,
]

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
 * Normaliza la respuesta de mcstatus.io o mcsrvstat.us a un formato común.
 */
function normalizeStatus(data) {
  const online = Boolean(data?.online)
  let icon = data?.icon
  if (icon && !icon.startsWith('data:')) icon = `data:image/png;base64,${icon}`
  let clean = data?.motd?.clean
  if (Array.isArray(clean)) clean = clean.join(' ').trim()
  else if (clean != null) clean = String(clean).replace(/\n/g, ' ').trim()
  const players = data?.players
  return { online, icon: icon || null, motdClean: clean || '', players }
}

/**
 * Obtiene el estado del servidor (puerto 25565). Prueba mcstatus.io y, si falla, mcsrvstat.us.
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

  const setLoading = (v) => { if (loading) loading.hidden = !v }
  const setContent = (v) => { if (content) content.hidden = !v }
  const setError = (v) => { if (errorEl) errorEl.hidden = !v }

  if (!loading || !content || !errorEl) return

  let data = null
  for (const url of STATUS_APIS) {
    try {
      const res = await fetch(url)
      if (res.ok) {
        data = await res.json()
        break
      }
    } catch {
      continue
    }
  }

  setLoading(false)
  setError(false)
  setContent(true)

  if (!data) {
    setContent(false)
    setError(true)
    return
  }

  const { online, icon: iconUrl, motdClean, players: playersData } = normalizeStatus(data)

  if (statusDot) {
    if (online) statusDot.classList.add('online')
    else statusDot.classList.remove('online')
  }
  if (statusText) statusText.textContent = online ? 'Online' : 'Offline'

  if (iconEl) {
    if (online && iconUrl) {
      iconEl.src = iconUrl
      iconEl.hidden = false
    } else {
      iconEl.hidden = true
    }
  }

  if (motdEl) {
    if (online && motdClean) {
      motdEl.textContent = motdClean
      motdEl.hidden = false
    } else {
      motdEl.textContent = ''
      motdEl.hidden = true
    }
  }

  if (playersEl) {
    if (online && playersData != null && typeof playersData.online === 'number') {
      const max = playersData.max ?? '?'
      playersEl.textContent = `${playersData.online} / ${max} players`
      playersEl.hidden = false
    } else {
      playersEl.textContent = ''
      playersEl.hidden = true
    }
  }
}

function initParticles() {
  const canvas = document.getElementById('particles-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles = []
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      color: ['#00f5ff', '#ff00aa', '#22c55e'][Math.floor(Math.random() * 3)]
    })
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    })
    requestAnimationFrame(animate)
  }
  animate()

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  })
}

function init() {
  const btn = document.querySelector('[data-copy-ip]')
  if (btn) btn.addEventListener('click', copyIP)
  fetchServerStatus()
  initParticles()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
