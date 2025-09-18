import { useRef } from "react";
import { FaPlus } from "react-icons/fa";

function NoteCard() {
  const previewRef = useRef<HTMLDivElement>(null);
  return (
    <div className="bg-stone-950 max-w-52 w-full mx-auto rounded-xl shadow-md">
      <div ref={previewRef} className="h-40 text-white text-6xl flex items-center justify-center">
        <FaPlus />
      </div>
      <div className="bg-stone-900 p-2 rounded-b-xl">
        <h3 className="text-white">Note Name</h3>
      </div>
    </div>
  );
}

export default NoteCard;
