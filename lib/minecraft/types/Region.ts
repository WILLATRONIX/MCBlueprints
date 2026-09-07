import type { Block } from "./Block";

export const REGION_SIZE = 16;
export const REGION_VOLUME = REGION_SIZE ** 3;

export interface Region {
	X: number;
	Y: number;
	Z: number;
	singleValuePalette: boolean;
	BlockStates: {
		palette: Block[];
		data?: bigint[];
	};
}

export function getBlockIndex(x: number, y: number, z: number): number {
	return x + y * REGION_SIZE + z * REGION_SIZE * REGION_SIZE;
}
