"use client";

import type { Editor, JSONContent } from "@/components/kibo-ui/editor";
import {
	EditorBubbleMenu,
	EditorClearFormatting,
	EditorFormatBold,
	EditorFormatItalic,
	EditorFormatStrike,
	EditorFormatSubscript,
	EditorFormatSuperscript,
	EditorFormatUnderline,
	EditorNodeBulletList,
	EditorNodeHeading1,
	EditorNodeHeading2,
	EditorNodeHeading3,
	EditorNodeOrderedList,
	EditorNodeQuote,
	EditorNodeText,
	EditorProvider,
	EditorSelector,
	EditorTableColumnAfter,
	EditorTableColumnBefore,
	EditorTableColumnDelete,
	EditorTableColumnMenu,
	EditorTableDelete,
	EditorTableFix,
	EditorTableGlobalMenu,
	EditorTableHeaderColumnToggle,
	EditorTableHeaderRowToggle,
	EditorTableMenu,
	EditorTableMergeCells,
	EditorTableRowAfter,
	EditorTableRowBefore,
	EditorTableRowDelete,
	EditorTableRowMenu,
	EditorTableSplitCell,
} from "@/components/kibo-ui/editor";
import { useState } from "react";

const CustomEditor = () => {
	const [content, setContent] = useState<JSONContent>({
		type: "doc",
		content: [{ type: "paragraph" }],
	});

	const handleUpdate = ({ editor }: { editor: Editor }) => {
		const json = editor.getJSON();
		console.log(editor.getHTML());

		setContent(json);
	};

	return (
		<EditorProvider
			className="w-full min-h-0 max-h-40 h-40 overflow-y-auto bg-muted border px-3 py-1"
			content={content}
			onUpdate={handleUpdate}
			placeholder="Start typing or '/' for commands"
		>
			<EditorBubbleMenu>
				<EditorSelector title="Text">
					<EditorNodeText />
					<EditorNodeHeading1 />
					<EditorNodeHeading2 />
					<EditorNodeHeading3 />
					<EditorNodeBulletList />
					<EditorNodeOrderedList />
					<EditorNodeQuote />
				</EditorSelector>
				<EditorSelector title="Format">
					<EditorFormatBold />
					<EditorFormatItalic />
					<EditorFormatUnderline />
					<EditorFormatStrike />
					<EditorFormatSuperscript />
					<EditorFormatSubscript />
				</EditorSelector>
				<EditorClearFormatting />
			</EditorBubbleMenu>
			<EditorTableMenu>
				<EditorTableColumnMenu>
					<EditorTableColumnBefore />
					<EditorTableColumnAfter />
					<EditorTableColumnDelete />
				</EditorTableColumnMenu>
				<EditorTableRowMenu>
					<EditorTableRowBefore />
					<EditorTableRowAfter />
					<EditorTableRowDelete />
				</EditorTableRowMenu>
				<EditorTableGlobalMenu>
					<EditorTableHeaderColumnToggle />
					<EditorTableHeaderRowToggle />
					<EditorTableDelete />
					<EditorTableMergeCells />
					<EditorTableSplitCell />
					<EditorTableFix />
				</EditorTableGlobalMenu>
			</EditorTableMenu>
		</EditorProvider>
	);
};

export default CustomEditor;
