import { useRef, useState } from "react";
import { FaAngleUp, FaRegFolder } from "react-icons/fa";

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
}: {
  folders: Folder[];
  setShown: (v: boolean) => void;
  loadNotes: () => Promise<void>;
  loadFolders: () => Promise<void>;
  authToken: string;
  type: "Note" | "Folder";
}) {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

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
          className="flex flex-row cursor-pointer bg-white text-black rounded-md p-2 w-40 justify-between"
        >
          {selectedFolder?.name || "Select Folder..."}
          <FaAngleUp
            className={`${
              isOpen ? "rotate-180" : "rotate-0"
            } !transition-all !duration-300 !ease-in-out my-1`}
          />
        </button>
        <div className="bg-white rounded-md text-black absolute top-full mt-2 w-52 max-h-40 overflow-y-auto">
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
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-900 text-white z-50 p-10 rounded-2xl w-fit text-lg">
      <h2>{`Create New ${type}`}</h2>
      <div className="my-2">
        <label htmlFor="name">{`${type} name: `}</label>
        <br />
        <input
          type="text"
          id="name"
          className="p-2 rounded-lg bg-white focus:outline-none text-black"
          ref={nameRef}
        />
        <br />
        <br />
        <label htmlFor="folder">Parent Folder:</label>
        <br />
        <Dropdown />
        <br />
        <br />
        <button
          onClick={async () => {
            if (type === "Note") {
              await addNote();
              await loadNotes();
              setShown(false);
            } else if (type === "Folder") {
              await addFolder();
              await loadFolders();
              setShown(false);
            }
          }}
          className="bg-stone-800 rounded-full w-1/2 p-3 block mx-auto cursor-pointer"
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default NewNoteMenu;
