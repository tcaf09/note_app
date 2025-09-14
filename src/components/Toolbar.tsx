import {
  FaEraser,
  FaHandPaper,
  FaICursor,
  FaMousePointer,
} from "react-icons/fa";
import ColourOption from "./ColourOption";

function Toolbar({
  selected,
  setSelected,
  setColour,
  colour,
  colours,
  penSizes,
  setPenSizes,
}: {
  selected: string;
  setSelected: (v: string) => void;
  setColour: (v: string) => void;
  colour: string;
  colours: string[];
  penSizes: number[];
  setPenSizes: React.Dispatch<React.SetStateAction<number[]>>
}) {
  

  return (
    <div className=" absolute top-2 left-1/2 -translate-x-1/2 z-50 w-auto rounded-lg p-3 mt-2 bg-stone-950 flex ">
      <div
        className={`mx-2 ${selected === "mouse"
            ? "border-white bg-white/20"
            : "border-transparent"
          } border w-fit p-2 rounded-md text-white`}
        onClick={() => setSelected("mouse")}
      >
        <FaMousePointer />
      </div>
      <div
        className={`mx-2 ${selected === "text"
            ? "border-white bg-white/20"
            : "border-transparent"
          } border w-fit p-2 rounded-md  text-white`}
        onClick={() => setSelected("text")}
      >
        <FaICursor />
      </div>
      <div
        className={`mx-2 ${selected === "pan" ? "border-white bg-white/20" : "border-transparent"
          } border w-fit p-2 rounded-md  text-white`}
        onClick={() => setSelected("pan")}
      >
        <FaHandPaper />
      </div>
      <div className="border mx-3 border-white h-8"></div>
      <div
        className={`mx-2 ${selected === "eraser"
            ? "border-white bg-white/20"
            : "border-transparent"
          } border w-fit p-2 rounded-md  text-white`}
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
        />
      ))}
    </div>
  );
}

export default Toolbar;
