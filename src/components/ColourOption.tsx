import { useState, useRef, useEffect } from "react";

type Props = {
  colour: string;
  setColour: (v: string) => void;
  c: string;
  selected: string;
  setSelected: (v: string) => void;
  penSize: number;
  setPenSize: (v: number) => void;
};

function ColourOption({
  colour,
  setColour,
  c,
  selected,
  setSelected,
  penSize,
  setPenSize,
}: Props) {
  const [menuShown, setMenuShown] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuShown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block mx-2 my-auto">
      <div
        className={`h-auto w-auto rounded-full p-1 flex border ${selected === "pen" && colour === c
            ? "border-white bg-white/20"
            : "border-transparent"
          }`}
        onClick={() => {
          if (selected === "pen" && colour === c) {
            setMenuShown(true);
          } else {
            setSelected("pen");
            setColour(c);
          }
        }}
      >
        <div
          className={`w-5 h-5 rounded-full`}
          style={{ backgroundColor: c }}
        ></div>
      </div>
      <div
        className={`${menuShown ? "absolute" : "hidden"} left-1/2 -translate-x-1/2 top-[150%] w-40 bg-stone-950 p-2 rounded-lg`}
        ref={menuRef}
      >
        <input
          type="range"
          min={1}
          max={4}
          value={penSize}
          onChange={(e) => setPenSize(Number(e.target.value))}
          style={{
            accentColor: c,
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default ColourOption;
