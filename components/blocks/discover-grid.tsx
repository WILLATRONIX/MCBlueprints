"use client";

import Asset from "@/lib/asset";
import AssetCard from "./asset-card";
import { Button } from "../ui/button";
import socket from "@/lib/websocket/websocketService";
import { FaultService } from "@/lib/fault/faultService";
import { Fault } from "@/lib/fault/fault";

const faultService = new FaultService(__filename);

export default function DiscoverGrid({ assets }: { assets: Asset[] }) {
	return (
		<div>
			<Button
				onClick={() => {
					socket?.send("test");
				}}
			>
				telemetry test
			</Button>
			<Button
				onClick={() => {
					faultService.raise(new Fault("Test Fault", "test"));
				}}
			>
				error test
			</Button>
			{assets.map((asset: Asset) => {
				return (
					<div key={asset.uuid}>
						<AssetCard asset={asset} />
					</div>
				);
			})}
		</div>
	);
}
