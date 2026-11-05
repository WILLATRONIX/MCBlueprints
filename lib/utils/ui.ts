export function snapToGrid(element: HTMLElement, gridSize = 16) {
	const rect = element.getBoundingClientRect();

	const x = Math.round(rect.left / gridSize) * gridSize;
	const y = Math.round(rect.top / gridSize) * gridSize;

	element.style.left = `${x}px`;
	element.style.top = `${y}px`;
}
