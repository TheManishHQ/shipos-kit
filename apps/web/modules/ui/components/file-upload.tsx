"use client";

import { cn } from "@ui/lib";
import { CloudUploadIcon } from "lucide-react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";

interface FileUploadProps extends DropzoneOptions {
	className?: string;
	label?: string;
	description?: string;
}

export function FileUpload({
	className,
	label = "Upload files",
	description = "Drag and drop files here, or click to select files",
	...dropzoneOptions
}: FileUploadProps) {
	const { getRootProps, getInputProps, isDragActive } = useDropzone(
		dropzoneOptions,
	);

	return (
		<div
			{...getRootProps()}
			className={cn(
				"flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary hover:bg-muted/50",
				isDragActive && "border-primary bg-muted/50",
				className,
			)}
		>
			<input {...getInputProps()} />
			<CloudUploadIcon className="mb-4 size-12 text-muted-foreground" />
			<p className="mb-1 font-medium text-sm">{label}</p>
			<p className="text-muted-foreground text-xs">{description}</p>
		</div>
	);
}
