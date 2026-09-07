"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export default function BackgroundDots({
	tileSize = 16,
	dotSize = 2,
}: {
	tileSize?: number;
	dotSize?: number;
}) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const theme = useTheme();

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		if (dpr < 1) return;

		const draw = () => {
			const rect = canvas.getBoundingClientRect();
			const width = Math.floor(rect.width);
			const height = Math.floor(rect.height);

			canvas.width = width * dpr;
			canvas.height = height * dpr;

			ctx.imageSmoothingEnabled = false;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			const patternCanvas = document.createElement("canvas");
			patternCanvas.width = tileSize;
			patternCanvas.height = tileSize;

			const pctx = patternCanvas.getContext("2d");
			if (!pctx) return;

			pctx.imageSmoothingEnabled = false;
			pctx.clearRect(0, 0, tileSize, tileSize);

			const colour =
				theme.theme === "dark"
					? "oklch(52% 0.105 223.128)"
					: "oklch(71.5% 0.143 215.221)";

			pctx.fillStyle = colour;
			pctx.fillRect(0, 0, dotSize, dotSize);

			const pattern = ctx.createPattern(patternCanvas, "repeat");
			if (!pattern) return;

			pattern.setTransform(
				new DOMMatrix().translate(
					-Math.floor(dotSize / 2),
					-Math.floor(dotSize / 2),
				),
			);

			ctx.fillStyle = pattern;
			ctx.fillRect(0, 0, width, height);
		};

		draw();
		window.addEventListener("resize", draw);
		return () => window.removeEventListener("resize", draw);
	}, [tileSize, dotSize, theme.theme]);

	return (
		<canvas
			ref={canvasRef}
			className="pointer-events-none absolute inset-0 z-0 w-full h-full"
			style={{
				display: "block",
				imageRendering: "pixelated",
			}}
		/>
	);
}
