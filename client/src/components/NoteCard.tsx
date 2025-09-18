import { useRef } from "react";

function NoteCard() {
  const previewRef = useRef<HTMLDivElement>(null);
  return (
    <div className="bg-stone-950 max-w-36 w-full mx-auto rounded-xl shadow-md">
      <div ref={previewRef} className="h-28"></div>
      <div className="bg-stone-900 p-2 rounded-b-xl">
        <h3 className="text-white">Note Name</h3>
      </div>
    </div>
  );
}

export default NoteCard;
