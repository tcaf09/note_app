type Note = {
  _id: string;
  name: string;
  folderId: string | null;
  thumbnailUrl: string;
};

type Folder = {
  _id: string;
  name: string;
  parentId: string | null;
};

function DeleteMenu({
  toDelete,
  type,
  setShown,
  loadNotes,
  loadFolders,
  authToken,
}: {
  toDelete: Note | Folder;
  type: "note" | "folder";
  setShown: (v: boolean) => void;
  loadNotes: () => Promise<void>;
  loadFolders: () => Promise<void>;
  authToken: string;
}) {
  async function deleteNote() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notes/${toDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Error deleting note");
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteFolder() {
    try {
      console.log(toDelete);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/folders/${toDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + authToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Error deleting note");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="z-50 text-stone-300 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-stone-900 to-stone-950 inset-shadow-xs inset-shadow-stone-700 shadow-sm shadow-stone-950 rounded-2xl p-4 flex flex-col items-center">
      <h2>Delete {toDelete.name}?</h2>
      <div className="w-full flex gap-4 my-2">
        <button
          className="grow p-2 rounded-lg text-red-600 hover:bg-red-600/20 border border-transparent hover:border-red-600 cursor-pointer"
          style={{ transition: "all 0.1s ease-in-out" }}
          onClick={async () => {
            if (type === "note") {
              await deleteNote();
              await loadNotes();
            } else if (type === "folder") {
              await deleteFolder();
              await loadFolders();
              await loadNotes();
            }
            setShown(false);
          }}
        >
          Confirm
        </button>
        <button
          className="grow p-2 rounded-lg border border-transparent hover:border-stone-300 hover:bg-stone-300/20 cursor-pointer"
          style={{ transition: "all 0.1s ease-in-out" }}
          onClick={() => setShown(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default DeleteMenu;
