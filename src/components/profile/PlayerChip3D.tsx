import { useEffect, useRef } from 'react'
import type * as THREE_NS from 'three'

/**
 * Жетон игрока — вращающаяся 3D-модель на three.js.
 * Автовращение вокруг оси; мышью/пальцем можно крутить самому.
 * Лицевая сторона — инициалы, обратная — демо-ставка из Slot Lab.
 * three.js подгружается динамическим импортом, чтобы не раздувать основной бандл.
 */
export function PlayerChip3D() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let disposed = false
    let cleanup = () => {}

    void (async () => {
      const THREE = await import('three')
      if (disposed || !hostRef.current) return

      // ---------- сцена ----------
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 20)
      camera.position.set(0, 0.55, 3.6)
      camera.lookAt(0, 0, 0)

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      host.appendChild(renderer.domElement)

      // ---------- материалы и текстуры граней ----------
      const disposeQueue: Array<{ dispose: () => void }> = []
      const track = <T extends { dispose: () => void }>(x: T): T => {
        disposeQueue.push(x)
        return x
      }

      const drawFace = (kind: 'obverse' | 'reverse'): THREE_NS.CanvasTexture => {
        const size = 512
        const c = document.createElement('canvas')
        c.width = size
        c.height = size
        const ctx = c.getContext('2d')!
        const TAU = Math.PI * 2

        // костяное поле
        ctx.fillStyle = '#f7f1df'
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, TAU)
        ctx.fill()
        // золотая кромка с насечками
        ctx.strokeStyle = '#8f6b1d'
        ctx.lineWidth = 28
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2 - 14, 0, TAU)
        ctx.stroke()
        // тонкое кольцо
        ctx.strokeStyle = 'rgba(143, 107, 29, 0.55)'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, 200, 0, TAU)
        ctx.stroke()

        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        // крышки цилиндра зеркалят UV — компенсируем заранее
        ctx.save()
        ctx.translate(size, 0)
        ctx.scale(-1, 1)
        if (kind === 'obverse') {
          ctx.fillStyle = '#5f470f'
          ctx.font = '400 168px Oranienbaum, Georgia, serif'
          ctx.fillText('ЯК', size / 2, size / 2 + 6)
        } else {
          // звезда
          ctx.fillStyle = '#c9a548'
          ctx.beginPath()
          const sx = size / 2
          const sy = 138
          const R = 34
          const r = 14
          for (let i = 0; i < 10; i++) {
            const rad = (Math.PI / 5) * i - Math.PI / 2
            const rr = i % 2 === 0 ? R : r
            const x = sx + Math.cos(rad) * rr
            const y = sy + Math.sin(rad) * rr
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.fill()
          // номинал
          ctx.fillStyle = '#5f470f'
          ctx.font = '700 180px Cinzel, Georgia, serif'
          ctx.fillText('20', size / 2, size / 2 + 14)
          // подпись с ручным трекингом
          ctx.fillStyle = '#8a681c'
          ctx.font = '700 30px Manrope, sans-serif'
          ctx.fillText('Д Е М О - С Т А В К А', size / 2, 398)
        }
        ctx.restore()

        return track(new THREE.CanvasTexture(c))
      }

      // дождаться шрифтов для текстур (с запасным таймаутом)
      try {
        await Promise.race([
          Promise.all([
            document.fonts.load('400 168px Oranienbaum'),
            document.fonts.load('700 180px Cinzel'),
            document.fonts.load('700 30px Manrope'),
          ]),
          new Promise((r) => setTimeout(r, 1500)),
        ])
      } catch {
        /* рисуем системным фолбэком */
      }
      if (disposed) return

      const faceTop = drawFace('obverse')
      const faceBottom = drawFace('reverse')
      faceTop.anisotropy = renderer.capabilities.getMaxAnisotropy()
      faceBottom.anisotropy = renderer.capabilities.getMaxAnisotropy()

      const gold = track(
        new THREE.MeshStandardMaterial({ color: 0xb3861f, metalness: 0.5, roughness: 0.3 }),
      )
      const ivory = track(
        new THREE.MeshStandardMaterial({ color: 0xf7f1df, metalness: 0.05, roughness: 0.55 }),
      )
      const faceMat = track(
        new THREE.MeshStandardMaterial({ map: faceTop, roughness: 0.5, metalness: 0.08 }),
      )
      const faceMatBack = track(
        new THREE.MeshStandardMaterial({ map: faceBottom, roughness: 0.5, metalness: 0.08 }),
      )

      // ---------- жетон ----------
      const pivot = new THREE.Group()
      const chip = new THREE.Group()
      chip.rotation.x = 1.08 // наклон: лицевая грань к камере
      pivot.add(chip)
      scene.add(pivot)

      const bodyGeo = track(new THREE.CylinderGeometry(1, 1, 0.2, 64))
      const body = new THREE.Mesh(bodyGeo, [gold, faceMat, faceMatBack])
      chip.add(body)

      // 12 костяных вкладок-насечек по кромке
      const notchGeo = track(new THREE.BoxGeometry(0.12, 0.21, 0.17))
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2
        const notch = new THREE.Mesh(notchGeo, ivory)
        notch.position.set(Math.cos(a) * 0.97, 0, Math.sin(a) * 0.97)
        notch.rotation.y = -a
        chip.add(notch)
      }

      // ---------- свет ----------
      scene.add(new THREE.AmbientLight(0xfff2d9, 0.75))
      const key = new THREE.DirectionalLight(0xffe9b8, 1.15)
      key.position.set(2, 3, 4)
      scene.add(key)
      const rim = new THREE.DirectionalLight(0xd9c084, 0.45)
      rim.position.set(-3, -1, -2)
      scene.add(rim)

      // ---------- размер ----------
      const resize = () => {
        const w = host.clientWidth || 180
        renderer.setSize(w, w)
        camera.aspect = 1
        camera.updateProjectionMatrix()
      }
      resize()
      const ro = new ResizeObserver(resize)
      ro.observe(host)

      // ---------- взаимодействие: покрутить самому ----------
      let dragging = false
      let lastX = 0
      let lastY = 0
      // покачивание вместо полного вращения: инициалы всегда читаемы,
      // полную раскрутку пользователь делает драгом
      let dragOffsetY = 0

      const onDown = (e: PointerEvent) => {
        dragging = true
        lastX = e.clientX
        lastY = e.clientY
        host.classList.add('grabbing')
        renderer.domElement.setPointerCapture(e.pointerId)
      }
      const onMove = (e: PointerEvent) => {
        if (!dragging) return
        dragOffsetY += (e.clientX - lastX) * 0.011
        chip.rotation.x = THREE.MathUtils.clamp(
          chip.rotation.x + (e.clientY - lastY) * 0.008,
          0.55,
          1.45,
        )
        lastX = e.clientX
        lastY = e.clientY
      }
      const onUp = (e: PointerEvent) => {
        dragging = false
        host.classList.remove('grabbing')
        renderer.domElement.releasePointerCapture(e.pointerId)
      }
      renderer.domElement.addEventListener('pointerdown', onDown)
      renderer.domElement.addEventListener('pointermove', onMove)
      renderer.domElement.addEventListener('pointerup', onUp)
      renderer.domElement.addEventListener('pointercancel', onUp)

      // ---------- цикл ----------
      let raf = 0
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const tick = () => {
        // мягкое покачивание ±~28° вокруг драг-смещения
        const sway = reduced || dragging ? 0 : Math.sin(performance.now() / 1600) * 0.5
        pivot.rotation.y = dragOffsetY + sway
        renderer.render(scene, camera)
        raf = window.requestAnimationFrame(tick)
      }
      tick()

      cleanup = () => {
        window.cancelAnimationFrame(raf)
        ro.disconnect()
        renderer.domElement.removeEventListener('pointerdown', onDown)
        renderer.domElement.removeEventListener('pointermove', onMove)
        renderer.domElement.removeEventListener('pointerup', onUp)
        renderer.domElement.removeEventListener('pointercancel', onUp)
        disposeQueue.forEach((d) => d.dispose())
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
  }, [])

  return (
    <div className="player-chip3d-wrap">
      <div ref={hostRef} className="player-chip3d" role="img" aria-label="Жетон игрока — вращающаяся 3D-модель: инициалы на лицевой стороне, демо-ставка 20 на обратной. Можно покрутить." />
      <p className="chip-hint">жетон игрока — покрути</p>
    </div>
  )
}
