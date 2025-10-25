import {
  FaEraser,
  FaHandPaper,
  FaICursor,
  FaMousePointer,
  FaPlus,
} from "react-icons/fa";
import ColourOption from "./ColourOption";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";

function Toolbar({
  selected,
  setSelected,
  setColour,
  colour,
  colours,
  penSizes,
  setPenSizes,
  setColours,
}: {
  selected: string;
  setSelected: (v: string) => void;
  setColour: (v: string) => void;
  colour: string;
  colours: string[];
  penSizes: number[];
  setPenSizes: React.Dispatch<React.SetStateAction<number[]>>;
  setColours: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [newColour, setNewColour] = useState<string>("#ffffff");

  return (
    <div className=" absolute top-4 left-1/2 -translate-x-1/2 z-50 w-auto rounded-lg p-3 bg-stone-950 inset-shadow-sm inset-shadow-stone-700 flex shadow-sm shadow-stone-950">
      <div
        className={`mx-2 ${selected === "mouse"
            ? "border-stone-300 bg-stone-300/20"
            : "border-transparent"
          } border w-fit p-2 rounded-md text-stone-300`}
        onClick={() => setSelected("mouse")}
      >
        <FaMousePointer />
      </div>
      <div
        className={`mx-2 ${selected === "text"
            ? "border-stone-300 bg-stone-300/20"
            : "border-transparent"
          } border w-fit p-2 rounded-md  text-stone-300`}
        onClick={() => setSelected("text")}
      >
        <FaICursor />
      </div>
      <div
        className={`mx-2 ${selected === "pan"
            ? "border-stone-300 bg-stone-300/20"
            : "border-transparent"
          } border w-fit p-2 rounded-md  text-stone-300`}
        onClick={() => setSelected("pan")}
      >
        <FaHandPaper />
      </div>
      <div className="border mx-3 border-stone-300 h-8"></div>
      <div
        className={`mx-2 ${selected === "eraser"
            ? "border-stone-300 bg-stone-300/20"
            : "border-transparent"
          } border w-fit p-2 rounded-md  text-stone-300`}
        onClick={() => setSelected("eraser")}
      >
        <FaEraser />
      </div>
      {colours.map((c, i) => (
        <ColourOption
          colour={colour}
          setColour={setColour}
          c={c}
          key={i}
          selected={selected}
          setSelected={setSelected}
          penSizes={penSizes}
          setPenSizes={setPenSizes}
          index={i}
          colours={colours}
          setColours={setColours}
        />
      ))}
      <div
        className={`mx-2 relative inline-block ${selected === "add"
            ? "border-stone-300 bg-stone-300/20"
            : "border-transparent"
          } border w-fit p-2 rounded-full  text-stone-300`}
        onClick={() => setSelected("add")}
      >
        <FaPlus />
        <div
          className={`${selected === "add" ? "absolute" : "hidden"
            } left-1/2 -translate-x-1/2 top-[150%] bg-stone-950 p-2 rounded-lg flex flex-col`}
        >
          <HexColorPicker color={newColour} onChange={setNewColour} />
          <button
            className="p-2 border border-stone-300 hover:bg-stone-300/20 my-2 rounded-md"
            onClick={(e) => {
              e.stopPropagation();
              setColours((prev) => [...prev, newColour]);
              setPenSizes((prev) => [...prev, 4]);
              setColour(newColour);
              setSelected("pen");
            }}
          >
            Add Colour
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
