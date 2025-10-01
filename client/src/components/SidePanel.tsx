import { useState } from "react";
import { FaAngleUp, FaRegUser } from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";

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

function SidePanel({
  username,
  folders,
  notes,
}: {
  username: string;
  folders: Folder[];
  notes: Note[];
}) {
  const [toggled, setToggled] = useState<boolean>(false);
  const [showFolders, setShowFolders] = useState<boolean>(false);
  const navigate = useNavigate();

  function Folder({ folder }: { folder: Folder }) {
    const [open, setOpen] = useState<boolean>(false);

    return (
      <>
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <p>{folder.name}</p>
          <FaAngleUp
            className="my-2"
            style={{
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "all 0.3s ease-in-out",
            }}
          />
        </div>
        <div className={`${open ? "h-auto" : "h-0"} overflow-hidden ml-4`}>
        {notes.map((note, i) => {
            if (note.folderId === folder._id) {
              return <p key={i} className="cursor-pointer" onClick={() => navigate(`/note/${note._id}`)}>{note.name}</p>;
            }
            return null;
          })}
          {folders.map((f, i) => {
            if (f.parentId === folder._id) {
              return <Folder folder={f} key={i} />;
            }
            return null;
          })}
        </div>
      </>
    );
  }

  return (
    <div
      className={`h-full absolute ${toggled ? "left-0" : "-left-48"} top-0 w-60 bg-stone-900 rounded-r-3xl text-white`}
      style={{
        transition: "all 0.3s ease-in-out",
      }}
    >
      <MdMenu
        className="float-right m-3 text-3xl cursor-pointer"
        onClick={() => setToggled(!toggled)}
      />
      <div className="flex my-4 mx-2 text-xl">
        <FaRegUser className="my-1 mx-2" />
        <p>{username}</p>
      </div>
      <div className="mr-12 ml-8 text-stone-400 text-lg">
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setShowFolders(!showFolders)}
        >
          <p>Folders</p>
          <FaAngleUp
            className="my-2"
            style={{
              transform: showFolders ? "rotate(180deg)" : "rotate(0deg)",
              transition: "all 0.3s ease-in-out",
            }}
          />
        </div>
        <div
          className={`${showFolders ? "h-auto" : "h-0"} overflow-hidden mx-4`}
        >
          {folders.map((folder, i) => {
            if (folder.parentId === null) {
              return <Folder folder={folder} key={i} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
