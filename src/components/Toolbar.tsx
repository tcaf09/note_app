import {
  FaEraser,
  FaHandPaper,
  FaICursor,
  FaMousePointer,
} from "react-icons/fa";

function Toolbar({
  selected,
  setSelected,
  setColour,
  colour,
}: {
  selected: string;
  setSelected: (v: string) => void;
  setColour: (v: string) => void;
  colour: string
}) {
  const colours = ["#E0E0E0", "#6CA0DC", "#E07A5F", "#7FB069"];

  const penColourOption = (c: string, index: number) => {
    return (
      <div
        className={`h-auto w-auto my-auto mx-2 rounded-full p-1 flex border ${selected === "pen" && colour === c
            ? "border-white bg-white/20"
            : "border-transparent"
          }`}
        onClick={() => {
          setSelected("pen");
          setColour(c);
        }}
        key={index}
      >
        <div
          className={`w-5 h-5 rounded-full`}
          style={{ backgroundColor: c }}
        ></div>
      </div>
    );
  };

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
      {colours.map((c, i) => penColourOption(c, i))}
    </div>
  );
}

export default Toolbar;
