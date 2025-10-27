import { useEffect, useRef } from "react";

function NewMiniMenu({
  setShowNewMenu,
  setNewNoteMenuShown,
  setMenuType,
}: {
  setShowNewMenu: (v: boolean) => void;
  setNewNoteMenuShown: (v: boolean) => void;
  setMenuType: (v: "Folder" | "Note") => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowNewMenu(false);
      }
    };
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowNewMenu]);
  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 w-max bg-stone-950 inset-shadow-sm inset-shadow-stone-700 z-50 rounded-xl"
    >
      <div
        className="p-2 px-4 rounded-t-xl hover:bg-stone-900 !transition-all !duration-150 !ease-in-out"
        onClick={() => {
          setMenuType("Note");
          setNewNoteMenuShown(true);
          setShowNewMenu(false);
        }}
      >
        <p>New Note</p>
      </div>
      <div
        className="p-2 px-4 rounded-b-xl hover:bg-stone-800"
        onClick={() => {
          setMenuType("Folder");
          setNewNoteMenuShown(true);
          setShowNewMenu(false);
        }}
      >
        <p>New Folder</p>
      </div>
    </div>
  );
}

export default NewMiniMenu;
