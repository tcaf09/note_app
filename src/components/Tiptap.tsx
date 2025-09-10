// src/Tiptap.tsx

import { BubbleMenu } from "@tiptap/react/menus";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaBold, FaUnderline, FaItalic } from "react-icons/fa";
import { useEffect } from "react";
import Heading from "@tiptap/extension-heading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./tiptap-ui-primitive/dropdown-menu";


const Tiptap = ({
  selected,
  onContextMenu,
}: {
  selected: boolean;
  onContextMenu?: (e: React.MouseEvent) => void;
}) => {
  const editor = useEditor({
    editable: selected,
    extensions: [
      StarterKit,
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ], // define your extension array
    editorProps: {
      attributes: {
        class: `prose prose-invert text-white ${selected ? "pointer-events-auto select-text" : "pointer-events-none select-none"} break-words focus:outline-none`,
      },
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(selected);
    }
  }, [selected, editor]);

  if (!editor) return null;

  return (
    <>
      <BubbleMenu editor={editor} options={{ placement: "bottom", offset: 8 }}>
        <div className="bubble-menu flex p-3 bg-stone-900 rounded-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-2 py-1 text-xs rounded font-extrabold text-white hover:bg-white hover:text-black">
                Style
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup className="flex flex-col bg-stone-900 p-2 rounded-3xl">
                <DropdownMenuItem asChild>
                  <button
                    className="px-2 py-1 text-xs my-2 rounded text-white hover:bg-white hover:text-black"
                    onClick={() => editor.chain().focus().setParagraph().run()}
                  >
                    Normal
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    className="px-2 py-1 text-xs my-2 rounded text-white hover:bg-white hover:text-black"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                  >
                    Heading 1
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    className="px-2 py-1 text-xs my-2 rounded text-white hover:bg-white hover:text-black"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                  >
                    Heading 2
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button
                    className="px-2 py-1 text-xs my-2 rounded text-white hover:bg-white hover:text-black"
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                  >
                    Heading 3
                  </button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className="px-2 py-1 text-xs rounded text-white hover:bg-white hover:text-black"
            type="button"
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className="px-2 py-1 text-xs rounded text-white hover:bg-white hover:text-black"
            type="button"
          >
            <FaItalic />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className="px-2 py-1 text-xs rounded text-white hover:bg-white hover:text-black"
            type="button"
          >
            <FaUnderline />
          </button>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} onContextMenu={onContextMenu} />
    </>
  );
};

export default Tiptap;
