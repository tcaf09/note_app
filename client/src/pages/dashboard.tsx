import DeleteMenu from "@/components/DeleteMenu";
import NewNoteMenu from "@/components/NewNoteMenu";
import NoteCard from "@/components/NoteCard";
import SidePanel from "@/components/SidePanel";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

type User = {
  username: string;
  password: string;
  email: string;
};

type Note = {
  _id: string;
  name: string;
  folderId: string;
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
  const [newNoteMenuShown, setNewNoteMenuShown] = useState<boolean>(false);
  const [deleteShown, setDeleteShown] = useState<boolean>(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  async function getNotes() {
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
  }

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

    async function getFolders() {
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
    }

    getFolders();
    getNotes();
    getUser();
  }, [authToken]);

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
            authToken={authToken || ""}
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
            note={noteToDelete || { _id: "", folderId: "", name: "" }}
            setShown={setDeleteShown}
            loadNotes={getNotes}
            authToken={authToken || ""}
          />
        </>
      )}
      <h1 className="text-white mx-auto my-20 text-center text-6xl">
        Welcome, {user && user.username}
      </h1>
      <div className="w-2/3 p-10 mx-auto rounded-3xl bg-black relative">
        <button
          className="bg-stone-800 text-white p-3 rounded-md absolute right-4 top-4 cursor-pointer"
          onClick={() => setNewNoteMenuShown(true)}
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
                    name: "No Folder",
                  }
                }
                setDeleteShown={setDeleteShown}
                setNoteToDelete={setNoteToDelete}
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
      />
    </div>
  );
}

export default Dashboard;
