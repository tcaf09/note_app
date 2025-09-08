import { useState } from "react";
import Textbox from "../components/Textbox";
import Toolbar from "../components/Toolbar";

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Pos = {
  x: number;
  y: number;
};

function Note() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [textboxes, setTextboxes] = useState<Box[]>([]);
  const [contextPos, setContextPos] = useState<Pos | null>(null);

  const addTextbox = (e: React.MouseEvent) => {
    const posx = e.clientX - 50;
    const posy = e.clientY - 50;

    setTextboxes((prev) => [
      ...prev,
      { x: posx, y: posy, width: 100, height: 100 },
    ]);

    setSelectedOption("mouse");
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextPos({ x: e.clientX, y: e.clientY})
  }

  return (
    <>
      <div
        className={`${selectedOption === "text" ? "cursor-text" : ""} w-screen h-screen`}
        onClick={(e) => {
          switch (selectedOption) {
            case "text":
              addTextbox(e);
          }
        }}
      >
        {textboxes.map((box, i) => (
          <Textbox key={i} props={box}/>
        ))}
      </div>
      <Toolbar selected={selectedOption} setSelected={setSelectedOption} />
    </>
  );
}

export default Note;
