export type BlockProperties = {
	facing?: string;
	half?: string;
	axis?: string;
	[key: string]: string | undefined;
};

export type BlockId = string;

export interface Block {
	Name: BlockId;
	Properties?: BlockProperties;
}
