import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"flex field-sizing-content min-h-16 w-full rounded-none border border-input bg-transparent px-2.5 py-2 text-xs transition-colors outline-none placeholder:text-foreground/80 focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:bg-input/80 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:aria-invalid:bg-destructive/40" +
					" [clip-path:polygon(10px_0%,100%_0%,100%_calc(100%-10px),calc(100%-10px)_100%,0%_100%,0%_10px)] before:[clip-path:inherit]",
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
