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

    const mouse = {
      x: 0,
      y: 0,
      previousX: 0,
      previousY: 0,
      active: false,
    }

    let width = 0
    let height = 0
    let columns = 0
    let rows = 0

    let brightness = new Float32Array(0)

    const activeCells = new Set<number>()

    let animationFrame: number | null = null

    const minRadius = 120
    const maxRadius = 0
    const maxSpeed = 200

    const brightnessPerFrame = 0.5
    const decayPerFrame = 0.005

    const dotOffset = Math.floor(dotSize / 2)

    let colour = ""

    const getBaseFill = () => `color-mix(in oklch, ${colour} 30%, transparent)`

    const getBrightFill = (value: number) =>
      `color-mix(in oklch, ${colour} 30%, white ${value * 80}%)`

    const drawBackground = () => {
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = getBaseFill()

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          ctx.fillRect(
            column * tileSize - dotOffset,
            row * tileSize - dotOffset,
            dotSize,
            dotSize
          )
        }
      }
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()

      width = Math.floor(rect.width)
      height = Math.floor(rect.height)

      columns = Math.ceil(width / tileSize)
      rows = Math.ceil(height / tileSize)

      canvas.width = width
      canvas.height = height

      ctx.imageSmoothingEnabled = false
      ctx.setTransform(1, 0, 0, 1, 0, 0)

      brightness = new Float32Array(columns * rows)

      activeCells.clear()

      drawBackground()
    }

    const draw = () => {
      animationFrame = null

      const dx = mouse.x - mouse.previousX
      const dy = mouse.y - mouse.previousY

      const speed = Math.sqrt(dx * dx + dy * dy)

      const speedFactor = Math.min(speed / maxSpeed, 1)

      const easedSpeed = speedFactor * speedFactor

      const radius = maxRadius - easedSpeed * (maxRadius - minRadius)

      if (mouse.active && radius > 0) {
        const distance = speed

        const steps = Math.max(1, Math.ceil(distance / (tileSize * 0.5)))

        const radiusSquared = radius * radius

        const falloff = radiusSquared * 0.05

        for (let i = 0; i <= steps; i++) {
          const t = i / steps

          const cursorX = mouse.previousX + dx * t

          const cursorY = mouse.previousY + dy * t

          const minX = Math.max(0, Math.floor((cursorX - radius) / tileSize))

          const maxX = Math.min(
            columns - 1,
            Math.ceil((cursorX + radius) / tileSize)
          )

          const minY = Math.max(0, Math.floor((cursorY - radius) / tileSize))

          const maxY = Math.min(
            rows - 1,
            Math.ceil((cursorY + radius) / tileSize)
          )

          for (let row = minY; row <= maxY; row++) {
            const y = row * tileSize
            const rowOffset = row * columns

            for (let column = minX; column <= maxX; column++) {
              const x = column * tileSize

              const distanceX = x - cursorX

              const distanceY = y - cursorY

              const distanceSquared =
                distanceX * distanceX + distanceY * distanceY

              if (distanceSquared >= radiusSquared) {
                continue
              }

              const influence = Math.exp(-distanceSquared / falloff)

              const index = rowOffset + column

              brightness[index] = Math.min(
                1,
                brightness[index] + brightnessPerFrame * influence
              )

              activeCells.add(index)
            }
          }
        }
      }

      for (const index of activeCells) {
        let value = brightness[index]

        value = Math.max(0, value - decayPerFrame)

        brightness[index] = value

        const row = Math.floor(index / columns)

        const column = index - row * columns

        const x = column * tileSize - dotOffset

        const y = row * tileSize - dotOffset

        ctx.clearRect(x, y, dotSize, dotSize)

        if (value > 0) {
          ctx.fillStyle = getBrightFill(value)

          ctx.fillRect(x, y, dotSize, dotSize)
        } else {
          ctx.fillStyle = getBaseFill()

          ctx.fillRect(x, y, dotSize, dotSize)

          activeCells.delete(index)
        }
      }

      mouse.previousX = mouse.x
      mouse.previousY = mouse.y

      if (mouse.active || activeCells.size > 0) {
        animationFrame = requestAnimationFrame(draw)
      }
    }

    const startAnimation = () => {
      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(draw)
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()

      const x = event.clientX - rect.left

      const y = event.clientY - rect.top

      if (!mouse.active) {
        mouse.previousX = x
        mouse.previousY = y
      }

      mouse.x = x
      mouse.y = y
      mouse.active = true

      startAnimation()
    }

    const handleMouseLeave = () => {
      mouse.active = false
      startAnimation()
    }

    colour = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim()

    resize()

    window.addEventListener("resize", resize)

    window.addEventListener("mousemove", handleMouseMove)

    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame)
      }

      window.removeEventListener("resize", resize)

      window.removeEventListener("mousemove", handleMouseMove)

      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [tileSize, dotSize, theme.theme])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      style={{
        display: "block",
        imageRendering: "pixelated",
      }}
    />
  )
}
