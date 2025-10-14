import { useRef } from "react";
import { FaRegFolder, FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Note = {
  _id: string;
  name: string;
  folderId: string | null;
};

type Folder = {
  _id: string;
  name: string;
  parentId: string | null;
};

function NoteCard({
  note,
  folder,
  setDeleteShown,
  setDeleteType,
  setToDelete,
}: {
  note: Note;
  folder: Folder;
  setDeleteShown: (v: boolean) => void;
  setDeleteType: (v: "note" | "folder") => void;
  setToDelete: (v: Note | Folder) => void;
}) {
  const navigate = useNavigate();

  const previewRef = useRef<HTMLDivElement>(null);
  return (
    <div
      className="bg-stone-950 w-52 rounded-xl shadow-md"
      onClick={() => navigate(`/note/${note._id}`)}
    >
      <div
        ref={previewRef}
        className="h-40 text-white flex items-center justify-center cursor-pointer"
      ></div>
      <div className="bg-stone-900 p-2 rounded-b-xl flex justify-between">
        <div>
          <p className="text-white text-xl">{note.name}</p>
          <div className="flex text-stone-500">
            <FaRegFolder className="my-1" />
            <p className="mx-2">{folder.name}</p>
          </div>
        </div>
        <div className="text-red-600 text-xl flex items-center justify-center">
          <button
            className="p-2 bg-transparent hover:bg-red-600/20 rounded-lg cursor-pointer"
            style={{ transition: "all 0.3s ease-in-out" }}
            onClick={(e) => {
              e.stopPropagation();
              setDeleteType("note");
              setToDelete(note);
              setDeleteShown(true);
            }}
          >
            <FaRegTrashAlt />
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteCard;
