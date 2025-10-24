import DeleteMenu from "@/components/DeleteMenu";
import NewNoteMenu from "@/components/NewNoteMenu";
import NoteCard from "@/components/NoteCard";
import SidePanel from "@/components/SidePanel";
import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

type User = {
  username: string;
  password: string;
  email: string;
};

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

function Dashboard() {
  const authToken = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

  const [menuType, setMenuType] = useState<"Note" | "Folder">("Note");
  const [newNoteMenuShown, setNewNoteMenuShown] = useState<boolean>(false);
  const [deleteShown, setDeleteShown] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<Note | Folder>({
    _id: "",
    folderId: "",
    name: "",
    thumbnailUrl: "",
  });
  const [deleteType, setDeleteType] = useState<"note" | "folder">("note");

  const [parentFolder, setParentFolder] = useState<Folder | null>(null);
  const getNotes = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notes/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to get notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.log(err);
    }
  }, [authToken]);

  const getFolders = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/folders/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to get Folers");
      const data = await res.json();
      setFolders(data);
    } catch (err) {
      console.log(err);
    }
  }, [authToken]);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
        });

        if (!res.ok) throw new Error("Failed to get user data");

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    }

    getFolders();
    getNotes();
    getUser();
  }, [authToken, getFolders, getNotes]);

  return (
    <div className="w-full h-full">
      {newNoteMenuShown && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
            onClick={() => setNewNoteMenuShown(false)}
          ></div>
          <NewNoteMenu
            folders={folders}
            setShown={setNewNoteMenuShown}
            loadNotes={getNotes}
            loadFolders={getFolders}
            authToken={authToken || ""}
            type={menuType}
            setType={setMenuType}
            parentFolder={parentFolder}
          />
        </>
      )}
      {deleteShown && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
            onClick={() => setNewNoteMenuShown(false)}
          ></div>
          <DeleteMenu
            toDelete={toDelete}
            type={deleteType}
            setShown={setDeleteShown}
            loadNotes={getNotes}
            loadFolders={getFolders}
            authToken={authToken || ""}
          />
        </>
      )}
      <h1 className="text-stone-300 mx-auto my-20 text-center text-6xl">
        Welcome, {user && user.username}
      </h1>
      <div className="w-2/3 p-10 mx-auto rounded-3xl bg-gradient-to-b to-stone-950 from-stone-900 to-20% inset-shadow-sm inset-shadow-stone-700 relative shadow-sm shadow-stone-950">
        <button
          className="bg-stone-800 inset-shadow-sm inset-shadow-stone-700 shadow-sm shadow-stone-950 text-stone-300 p-3 rounded-md absolute right-4 top-4 cursor-pointer"
          onClick={() => {
            setParentFolder(null);
            setNewNoteMenuShown(true);
          }}
        >
          <FaPlus />
        </button>
        <div className="flex flex-wrap gap-5 items-start justify-start mt-10">
          {notes.map((note, i) => {
            return (
              <NoteCard
                note={note}
                folder={
                  folders.find((folder) => folder._id === note.folderId) || {
                    _id: "",
                    name: "No Folder",
                    parentId: "",
                  }
                }
                setDeleteShown={setDeleteShown}
                setToDelete={setToDelete}
                setDeleteType={setDeleteType}
                key={i}
              />
            );
          })}
        </div>
      </div>
      <SidePanel
        username={user ? user.username : "User"}
        folders={folders}
        notes={notes}
        setNewNoteMenuShown={setNewNoteMenuShown}
        setMenuType={setMenuType}
        setToDelete={setToDelete}
        setDeleteType={setDeleteType}
        setDeleteMenuShown={setDeleteShown}
        setParentFolder={setParentFolder}
      />
    </div>
  );
}

export default Dashboard;
