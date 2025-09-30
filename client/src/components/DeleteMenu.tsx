type Note = {
  _id: string;
  name: string;
  folderId: string;
};

function DeleteMenu({
  note,
  setShown,
  authToken,
}: {
  note: Note;
  setShown: (v: boolean) => void;
  authToken: string;
}) {
  async function deleteNote() {
    try {
      const res = await fetch(`http://localhost:5000/api/notes/${note._id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + authToken,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Error deleting note");

      console.log("Note Removed");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="z-50 text-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-900 rounded-2xl p-4 flex flex-col items-center">
      <h2>Delete {note.name}?</h2>
      <div className="w-full flex gap-4 my-2">
        <button
          className="grow p-2 rounded-lg text-red-600 hover:bg-red-600/20 border border-transparent hover:border-red-600 cursor-pointer"
          style={{ transition: "all 0.1s ease-in-out" }}
          onClick={() => {
            deleteNote();
            setShown(false);
          }}
        >
          Confirm
        </button>
        <button
          className="grow p-2 rounded-lg border border-transparent hover:border-white hover:bg-white/20 cursor-pointer"
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
