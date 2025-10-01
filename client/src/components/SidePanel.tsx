import { useState } from "react";
import {
  FaAngleUp,
  FaRegUser,
  FaRegFolder,
  FaRegStickyNote,
  FaPlus,
} from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import NewMiniMenu from "./NewMiniMenu";

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
  const navigate = useNavigate();

  function Folder({ folder }: { folder: Folder }) {
    const [open, setOpen] = useState<boolean>(true);
    const [hover, setHover] = useState<boolean>(false);
    const [showNewMenu, setShowNewMenu] = useState<boolean>(false);

    return (
      <>
        <div
          className="flex justify-between cursor-pointer my-1"
          onClick={() => setOpen(!open)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          <div className="flex gap-2">
            <FaRegFolder className="my-1" />
            <p>{folder.name}</p>
          </div>
          <div className="flex relative gap-4">
            <FaPlus
              className={`my-2  ${
                hover ? "text-stone-400" : "text-transparent"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setShowNewMenu(true);
              }}
            />
            {showNewMenu && <NewMiniMenu setShowNewMenu={setShowNewMenu} />}
            <FaAngleUp
              className="my-2"
              style={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "all 0.3s ease-in-out",
              }}
            />
          </div>
        </div>
        <div
          className={`${
            open ? "h-auto overflow-visible" : "h-0 overflow-hidden"
          }  ml-4`}
        >
          {notes.map((note, i) => {
            if (note.folderId === folder._id) {
              return (
                <div
                  className="flex gap-2 cursor-pointer my-1"
                  onClick={() => navigate(`/note/${note._id}`)}
                >
                  <FaRegStickyNote className="my-1" />
                  <p key={i} className="cursor-pointer">
                    {note.name}
                  </p>
                </div>
              );
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
      className={`h-full fixed ${
        toggled ? "left-0" : "-left-48"
      } top-0 w-60 bg-stone-900 rounded-r-3xl text-white`}
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
      <div className="mr-12 ml-3 text-lg">
        <p className="text-stone-400 my-3">Notes</p>
        {notes.map((note, i) => {
          if (note.folderId === null) {
            return (
              <div
                className="flex gap-2 cursor-pointer my-2"
                onClick={() => navigate(`/note/${note._id}`)}
              >
                <FaRegStickyNote className="my-1" />
                <p key={i} className="cursor-pointer">
                  {note.name}
                </p>
              </div>
            );
          }
        })}
        {folders.map((folder, i) => {
          if (folder.parentId === null) {
            return <Folder folder={folder} key={i} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default SidePanel;
