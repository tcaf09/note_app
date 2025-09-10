// src/Tiptap.tsx

import { BubbleMenu } from "@tiptap/react/menus";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaBold, FaUnderline, FaItalic } from "react-icons/fa";
import { useEffect } from "react";
import { HeadingDropdownMenu } from "./tiptap-ui/heading-dropdown-menu";
import Heading from "@tiptap/extension-heading";


type Size = {
  width: 100;
  height: 100;
};

const Tiptap = ({
  selected,
  size,
  onContextMenu,
}: {
  selected: boolean;
  size: Size;
  onContextMenu?: (e: React.MouseEvent) => void;
}) => {
  const editor = useEditor({
    editable: selected,
    extensions: [StarterKit.configure({
      heading: false,
    }), Heading.configure({
        levels: [1, 2, 3]
      })], // define your extension array
    editorProps: {
      attributes: {
        class: `text-white ${selected ? "pointer-events-auto select-text" : "pointer-events-none select-none"} break-words focus:outline-none`,
        style: `min-height: ${size.height}px;`,
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
        <HeadingDropdownMenu
          editor={editor}
          levels={[1, 2, 3]}
          hideWhenUnavailable={true}
          portal={false}
        />
        <div className="bubble-menu flex p-3 bg-stone-900 rounded-full">
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
