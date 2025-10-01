import { useEffect, useRef } from "react";

function NewMiniMenu({
  setShowNewMenu,
}: {
  setShowNewMenu: (v: boolean) => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowNewMenu(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={menuRef}
      className="absolute top-full left-0 w-max bg-black z-50 rounded-xl"
    >
      <div className="p-2 px-4 rounded-t-xl hover:bg-stone-800">
        <p>New Note</p>
      </div>
      <div className="p-2 px-4 rounded-b-xl hover:bg-stone-800">
        <p>New Folder</p>
      </div>
    </div>
  );
}

export default NewMiniMenu;
