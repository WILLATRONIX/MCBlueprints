import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Select as SelectPrimitive } from "radix-ui";

type Item = {
	value: string;
	label: string;
	description: string;
};

export default function DescriptiveSelect({
	items,
	selectProps,
	placeholder = "Select a value...",
}: {
	items: Item[];
	selectProps?: React.ComponentProps<typeof SelectPrimitive.Root>;
	placeholder?: string;
}) {
	return (
		<Select {...selectProps}>
			<SelectTrigger className="[&_small]:hidden">
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent position="popper" align="end" className="max-w-64">
				<SelectGroup>
					{items.map((level) => (
						<SelectItem key={level.value} value={level.value}>
							<span className="flex flex-col items-start gap-px">
								<span>{level.label}</span>
								<small className="text-muted-foreground text-xs">
									{level.description}
								</small>
							</span>
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}
