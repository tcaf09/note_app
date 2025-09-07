// src/Tiptap.tsx

import { BubbleMenu } from "@tiptap/react/menus";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FaBold, FaUnderline, FaItalic } from "react-icons/fa";
import { useEffect } from "react";

const Tiptap = ({ selected }: { selected: boolean }) => {
  const editor = useEditor({
    editable: selected,
    extensions: [StarterKit], // define your extension array
    editorProps: {
      attributes: {
        class: `${selected ? "pointer-events-auto select-text" : "pointer-events-none select-none"} text-white break-words focus:outline-none`,
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
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-2 py-1  text-xs rounded text-white ${
              editor.isActive("bold")
                ? "bg-purple-500 hover:bg-purple-600 "
                : "hover:bg-white text-black"
            }`}
            type="button"
          >
            <FaBold />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-2 py-1 text-xs rounded text-white ${
              editor.isActive("italic")
                ? "bg-purple-500 hover:bg-purple-600 "
                : "hover:bg-white text-black"
            }`}
            type="button"
          >
            <FaItalic />
          </button>

          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-2 py-1 text-xs rounded text-white ${
              editor.isActive("italic")
                ? "bg-purple-500 hover:bg-purple-600 "
                : "hover:bg-white text-black" 
            }`}
            type="button"
          >
            <FaUnderline />
          </button>
        </div>
      </BubbleMenu>

      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
