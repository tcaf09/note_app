import { useRef, useState } from "react";
import { FaAngleUp, FaRegFolder } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type Folder = {
  _id: string | null;
  name: string;
  parentId: string | null;
};

function NewNoteMenu({
  folders,
  setShown,
  loadNotes,
  loadFolders,
  authToken,
  type,
  setType,
  parentFolder,
}: {
  folders: Folder[];
  setShown: (v: boolean) => void;
  loadNotes: () => Promise<void>;
  loadFolders: () => Promise<void>;
  authToken: string;
  type: "Note" | "Folder";
  setType: (v: "Note" | "Folder") => void;
  parentFolder: Folder | null;
}) {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(
    parentFolder
  );
  const nameRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const root: Folder = {
    _id: null,
    name: "Root",
    parentId: null,
  };

  async function addNote() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notes`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameRef.current ? nameRef.current.value : "",
          folderId: selectedFolder?._id,
        }),
      });

      if (!res.ok) throw new Error("Error adding note");
      const data = await res.json();
      return data.insertedId;
    } catch (err) {
      console.log(err);
    }
  }

  async function addFolder() {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/folders`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: nameRef.current?.value,
          parentId: selectedFolder?._id,
        }),
      });

      if (!res.ok) throw new Error("Error adding folder");
    } catch (err) {
      console.log(err);
    }
  }

  const FolderComponent = ({
    folder,
    depth = 0,
  }: {
    folder: Folder;
    depth?: number;
  }) => {
    const options = folders.filter((opt) => opt.parentId === folder._id);
    return (
      <>
        <div
          style={{
            paddingLeft: `${16 + depth * 20}px`,
          }}
          onClick={() => setSelectedFolder(folder)}
          className="p-2 cursor-pointer rounded-md hover:bg-stone-200 flex flex-row"
        >
          <FaRegFolder className="mt-1 mr-2" />
          {folder.name}
        </div>
        {options.map((opt) => (
          <FolderComponent folder={opt} depth={depth + 1} key={opt._id} />
        ))}
      </>
    );
  };

  const Dropdown = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-row cursor-pointer bg-stone-300 text-black rounded-md p-2 w-40 justify-between"
        >
          {selectedFolder?.name || "Select Folder..."}
          <FaAngleUp
            className={`${
              isOpen ? "rotate-180" : "rotate-0"
            } !transition-all !duration-150 !ease-in-out my-1`}
          />
        </button>
        <div className="bg-stone-300 rounded-md text-black absolute top-full mt-2 w-52 max-h-40 overflow-y-auto">
          {isOpen && (
            <>
              <div
                style={{ paddingLeft: "16px" }}
                onClick={() => setSelectedFolder(root)}
                className="p-2 cursor-pointer rounded-md hover:bg-stone-200 flex flex-row"
              >
                <FaRegFolder className="mt-1 mr-2" />
                <p>Root</p>
              </div>

              {folders.map((folder) =>
                folder.parentId === null ? (
                  <FolderComponent folder={folder} key={folder._id} />
                ) : null
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b to-stone-900 from-stone-800 to-30% inset-shadow-xs inset-shadow-stone-700 shadow-sm shadow-stone-950 text-stone-300 z-50 p-10 rounded-2xl w-fit text-lg">
      {!parentFolder && (
        <div className="flex h-12 rounded-full bg-stone-900 inset-shadow-sm inset-shadow-stone-950 shadow-xs shadow-stone-950 justify-between w-full p-1 relative">
          <div
            className={`absolute ${
              type === "Folder" ? "left-1" : "left-[calc(50%+0.125rem)]"
            } h-10 rounded-full bg-stone-800 text-stone-300 shadow-xs shadow-stone-950 inset-shadow-xs inset-shadow-stone-700 !transition-all !duration-150 !ease-in-out`}
            style={{
              width: "calc(50% - 0.25rem)",
            }}
          ></div>
          <p
            onClick={() => setType("Folder")}
            className={`cursor-pointer rounded-full z-50 flex-1 text-center ${
              type === "Folder" ? "text-stone-300" : "text-stone-500"
            } py-2`}
          >
            Folder
          </p>
          <p
            className={`cursor-pointer rounded-full flex-1 text-center py-2 z-50 ${
              type === "Note" ? "text-stone-300" : "text-stone-500"
            }`}
            onClick={() => {
              setType("Note");
            }}
          >
            Note
          </p>
        </div>
      )}
      {parentFolder && <h2>{`Create New ${type}`}</h2>}
      <div className="my-2">
        <label htmlFor="name">{`${type} name: `}</label>
        <br />
        <input
          type="text"
          id="name"
          className="p-2 rounded-lg bg-stone-300 focus:outline-none text-black"
          ref={nameRef}
        />
        <br />
        <br />
        {!parentFolder && (
          <>
            <label htmlFor="folder">Parent Folder:</label>
            <br />
            <Dropdown />
            <br />
            <br />
          </>
        )}
        <button
          onClick={async () => {
            if (type === "Note") {
              const noteId = await addNote();
              await loadNotes();
              setShown(false);
              navigate(`/note/${noteId}`);
            } else if (type === "Folder") {
              await addFolder();
              await loadFolders();
              setShown(false);
            }
          }}
          className="bg-stone-800 rounded-full w-1/2 p-3 block mx-auto cursor-pointer inset-shadow-sm inset-shadow-stone-700 shadow-sm shadow-stone-950 !transition-all !duration-150 !ease-in-out hover:scale-103"
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default NewNoteMenu;
