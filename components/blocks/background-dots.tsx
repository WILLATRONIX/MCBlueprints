"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export default function BackgroundDots({
  tileSize = 16,
  dotSize = 2,
}: {
  tileSize?: number
  dotSize?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const theme = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    const mouse = {
      x: 0,
      y: 0,
      previousX: 0,
      previousY: 0,
      active: false,
    }

    const brightness = new Map<string, number>()

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()

      const x = event.clientX - rect.left
      const y = event.clientY - rect.top

      if (!mouse.active) {
        mouse.previousX = x
        mouse.previousY = y
      } else {
        mouse.previousX = mouse.x
        mouse.previousY = mouse.y
      }

      mouse.x = x
      mouse.y = y
      mouse.active = true
    }

    const handleMouseLeave = () => {
      mouse.active = false
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()

      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)

      ctx.imageSmoothingEnabled = false
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      const width = Math.floor(rect.width)
      const height = Math.floor(rect.height)

      const root = document.documentElement
      const styles = getComputedStyle(root)
      const colour = styles.getPropertyValue("--primary").trim()

      ctx.clearRect(0, 0, width, height)

      const dx = mouse.x - mouse.previousX
      const dy = mouse.y - mouse.previousY
      const speed = Math.sqrt(dx * dx + dy * dy)

      const minRadius = 70
      const maxRadius = 0
      const maxSpeed = 400

      const speedFactor = Math.min(speed / maxSpeed, 1)
      const easedSpeed = speedFactor * speedFactor

      const radius = maxRadius - easedSpeed * (maxRadius - minRadius)
      const brightnessPerFrame = 0.5
      const decayPerFrame = 0.025

      if (mouse.active) {
        const dx = mouse.x - mouse.previousX
        const dy = mouse.y - mouse.previousY
        const distance = Math.sqrt(dx * dx + dy * dy)

        const steps = Math.max(1, Math.ceil(distance / (tileSize * 0.5)))

        for (let i = 0; i <= steps; i++) {
          const t = i / steps

          const cursorX = mouse.previousX + dx * t
          const cursorY = mouse.previousY + dy * t

          const minX = Math.floor((cursorX - radius) / tileSize) * tileSize

          const maxX = Math.ceil((cursorX + radius) / tileSize) * tileSize

          const minY = Math.floor((cursorY - radius) / tileSize) * tileSize

          const maxY = Math.ceil((cursorY + radius) / tileSize) * tileSize

          for (let y = minY; y <= maxY; y += tileSize) {
            for (let x = minX; x <= maxX; x += tileSize) {
              const distanceX = x - cursorX
              const distanceY = y - cursorY
              const distance = Math.sqrt(
                distanceX * distanceX + distanceY * distanceY
              )

              if (distance >= radius) continue

              const key = `${x}:${y}`

              const influence = Math.exp(
                -(distance * distance) / (radius * radius * 0.05)
              )

              const current = brightness.get(key) ?? 0

              brightness.set(
                key,
                Math.min(1, current + brightnessPerFrame * influence)
              )
            }
          }
        }
      }

      for (let y = 0; y < height; y += tileSize) {
        for (let x = 0; x < width; x += tileSize) {
          const key = `${x}:${y}`
          let value = brightness.get(key) ?? 0

          value = Math.max(0, value - decayPerFrame)

          if (value > 0) {
            brightness.set(key, value)
          } else {
            brightness.delete(key)
          }

          const fill =
            value === 0
              ? `color-mix(in oklch, ${colour} 30%, transparent)`
              : `color-mix(in oklch, ${colour} 30%, white ${value * 80}%)`

          ctx.fillStyle = fill
          ctx.fillRect(
            x - Math.floor(dotSize / 2),
            y - Math.floor(dotSize / 2),
            dotSize,
            dotSize
          )
        }
      }

      requestAnimationFrame(draw)
    }

    resize()
    draw()

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [tileSize, dotSize, theme.theme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 top-1/2 left-1/2 z-0 h-[256rem] w-[256rem] -translate-1/2"
      style={{
        display: "block",
        imageRendering: "pixelated",
      }}
    />
  )
}
