"use client";

import {
	ImageCrop,
	ImageCropApply,
	ImageCropContent,
	ImageCropReset,
} from "@/components/kibo-ui/image-crop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getBufferHash } from "@/lib/utils/hash";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { type ChangeEvent, useEffect, useState } from "react";
import { PercentCrop, PixelCrop } from "react-image-crop";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AspectRatio } from "@/lib/utils/aspectRatio";
import { Separator } from "../ui/separator";

export default function ImageEditor({
	defaultFile,
	aspectRatioLocked = false,
	defaultAspectRatio = "1:1",
	onChangeAction = () => {},
}: {
	defaultFile: File;
	aspectRatioLocked: boolean;
	defaultAspectRatio: string;
	onChangeAction?: (file: File) => void;
}) {
	const [selectedFile, setSelectedFile] = useState<File | null>(
		defaultFile ?? null,
	);
	const [croppedImage, setCroppedImage] = useState<string | null>(null);
	const [imagePercentageCrop, setImagePercentageCrop] = useState<PercentCrop>({
		unit: "%",
		width: 100,
		height: 100,
		x: 0,
		y: 0,
	});
	const [imagePixelCrop, setImagePixelCrop] = useState<PixelCrop>();
	const [currentImageHash, setCurrentImageHash] = useState<string>();
	const [defaultImageHash, setDefaultImageHash] = useState<string>();
	const [aspectRatio, setAspectRatio] = useState<string>(defaultAspectRatio);
	const [aspectNumber, setAspectNumber] = useState<number>(
		new AspectRatio(defaultAspectRatio).toNumber(),
	);

	const isOriginalImage = currentImageHash === defaultImageHash;

	useEffect(() => {
		const updateHashes = async () => {
			const defaultImageArrayBuffer = await defaultFile.arrayBuffer();
			const defaultImageHash = await getBufferHash(defaultImageArrayBuffer);
			setDefaultImageHash(defaultImageHash);

			if (!currentImageHash) {
				setCurrentImageHash(defaultImageHash);
			}
		};
		updateHashes();
	}, [currentImageHash, defaultFile]);

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			onChangeAction(file);
			setCroppedImage(null);
		}
	};

	const handleReset = () => {
		setSelectedFile(null);
		setCroppedImage(null);
	};

	const handleCrop = (crop: PixelCrop, percentageCrop: PercentCrop) => {
		setImagePercentageCrop(percentageCrop);
		setImagePixelCrop(crop);
	};

	const handleUploadImage = async (file: File) => {
		const arrayBuffer = await file.arrayBuffer();
		const uploadHash = await getBufferHash(arrayBuffer);
		setCurrentImageHash(uploadHash);
		setSelectedFile(file);
	};

	const handleAspectRatioChange = (newValue: string) => {
		const ratio = new AspectRatio(newValue);

		setAspectRatio(ratio.toString());
		setAspectNumber(ratio.toNumber());
	};

	if (!selectedFile) {
		return (
			<Input
				accept="image/*"
				className="w-full"
				onChange={handleFileChange}
				type="file"
			/>
		);
	}

	if (croppedImage) {
		return (
			<div className="space-y-4">
				<Image
					alt="Cropped"
					height={100}
					src={croppedImage}
					unoptimized
					width={100}
				/>
				<Button onClick={handleReset} size="icon" type="button" variant="ghost">
					<XIcon className="size-4" />
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<ImageCrop
				aspect={aspectNumber}
				file={selectedFile}
				maxImageSize={1024 * 1024} // 1MB
				onChange={handleCrop}
				onComplete={handleCrop}
				crop={imagePercentageCrop}
				ruleOfThirds
				minHeight={64}
				minWidth={64}
				className="w-full"
			>
				<ImageCropContent flipped={isOriginalImage} />
				<div className="flex items-center gap-2 justify-end">
					{!aspectRatioLocked && (
						<Select defaultValue="1:1" onValueChange={handleAspectRatioChange}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select aspect ratio" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Aspect Ratio</SelectLabel>
									<SelectItem value="1:1">1:1</SelectItem>
									<SelectItem value="4:3">4:3</SelectItem>
									<SelectItem value="16:9">16:9</SelectItem>
									<SelectItem value="2:1">2:1</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					)}
					<ImageCropReset asChild>
						<Button
							onClick={() => {
								setImagePercentageCrop({
									unit: "%",
									width: 100,
									height: 100,
									x: 0,
									y: 0,
								});
							}}
							variant="outline"
						>
							Reset Crop
						</Button>
					</ImageCropReset>
					<Button asChild>
						<label>
							Add Image
							<input
								type="file"
								hidden
								accept=".png,.jpeg,.jpg,.webp"
								onChange={(event) => {
									const file = event.target.files
										? event.target.files[0]
										: null;
									if (file === null) return;
									handleUploadImage(file);
								}}
							/>
						</label>
					</Button>
				</div>
				<Separator />
				<div className="flex items-center justify-end gap-2">
					<Button variant="outline">Cancel</Button>
					<ImageCropApply asChild>
						<Button>Save Changes</Button>
					</ImageCropApply>
				</div>
			</ImageCrop>
		</div>
	);
}
