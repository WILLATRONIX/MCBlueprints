import * as React from "react";

import { cn } from "@/lib/utils";

const inputWrapper =
	"h-8 w-full min-w-0" +
	" focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50" +
	" drop-shadow-cyan-950/60 drop-shadow-[2px_2px_0]"; // shadow

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<div className={cn(inputWrapper, className)}>
			<input
				type={type}
				data-slot="input"
				className={cn(
					"h-full w-full min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-foreground/80 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive dark:bg-input/80 dark:disabled:bg-input/60 dark:aria-invalid:border-destructive/50 aria-invalid:bg-destructive/20 dark:aria-invalid:bg-destructive/40" +
						" [clip-path:polygon(10px_0%,100%_0%,100%_calc(100%-10px),calc(100%-10px)_100%,0%_100%,0%_10px)] before:[clip-path:inherit]",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

export { Input };
