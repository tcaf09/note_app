import { FaICursor, FaMousePointer } from "react-icons/fa";

function Toolbar({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (v: string) => void;
}) {
  const penColourOption = (colour: string) => {
    return (
      <div
        className={`h-auto w-auto my-auto rounded-full p-1 flex border ${
          selected === colour
            ? "border-white bg-white/20"
            : "border-transparent"
        }`}
        onClick={() => setSelected(colour)}
      >
        <div className={`w-5 h-5 rounded-full bg-${colour}`}></div>
      </div>
    );
  };

  return (
    <div className=" absolute top-2 left-1/2 -translate-x-1/2 z-50 w-1/2 rounded-lg p-3 m-auto mt-2 bg-stone-950 flex ">
      <div
        className={`mx-2 ${
          selected === "mouse"
            ? "border-white bg-white/20"
            : "border-transparent"
        } border w-fit p-2 rounded-md text-white`}
        onClick={() => setSelected("mouse")}
      >
        <FaMousePointer />
      </div>
      <div
        className={`mx-2 ${
          selected === "text"
            ? "border-white bg-white/20"
            : "border-transparent"
        } border w-fit p-2 rounded-md  text-white`}
        onClick={() => setSelected("text")}
      >
        <FaICursor />
      </div>
      <div className="border mx-3 border-white h-8"></div>
      {penColourOption("white")}
    </div>
  );
}

export default Toolbar;
