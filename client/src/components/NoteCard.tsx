import { useRef } from "react";
import { FaRegCalendar, FaRegTrashAlt } from "react-icons/fa";

function NoteCard() {
  const previewRef = useRef<HTMLDivElement>(null);
  return (
    <div className="bg-stone-950 max-w-52 w-full mx-auto rounded-xl shadow-md">
      <div
        ref={previewRef}
        className="h-40 text-white flex items-center justify-center"
      ></div>
      <div className="bg-stone-900 p-2 rounded-b-xl flex">
        <div>
          <p className="text-white text-xl">Note Name</p>
          <div className="flex text-stone-500">
            <FaRegCalendar className="my-1" />
            <p className="mx-2">Monday 2/12</p>
          </div>
        </div>
        <div className="text-red-600 text-xl flex items-center justify-center grow cursor-pointer">
          <div className="p-2 bg-transparent hover:bg-red-600/20 rounded-lg">
            <FaRegTrashAlt />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
