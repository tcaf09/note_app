import { useState, useRef, useEffect } from "react";
import Textbox from "./Textbox";
import ContextMenu from "./ContextMenu";

type Pos = {
  x: number;
  y: number;
};

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  selectedOption: string;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
};

function InfiniteCanvas({ selectedOption, setSelectedOption }: Props) {
  const [pos, setPos] = useState<Pos>({ x: 0, y: 0 });
  const [scale, setScale] = useState<number>(1);
  const contextRef = useRef<HTMLDivElement>(null);
  const [contextPos, setContextPos] = useState<Pos | null>(null);
  const [textboxes, setTextboxes] = useState<Box[]>([]);
  const [contextTargetIndex, setContextTargetIndex] = useState<number | null>(
    null,
  );

  function handleWheel(e: React.WheelEvent) {
    if (e.ctrlKey) {
      setScale((s) => Math.max(0.1, s - e.deltaY * 0.001));
    } else {
      setPos((p) => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
    }
  }

  const handleContextMenu = (e: React.MouseEvent, index: number) => {
    e.stopPropagation()
    e.preventDefault();
    setContextPos({ x: e.clientX, y: e.clientY });
    setContextTargetIndex(index);
  };

  const deleteTextbox = () => {
    if (contextTargetIndex !== null) {
      setTextboxes((prev) =>
        prev.filter((_, index) => index !== contextTargetIndex),
      );
      setContextPos(null);
      setContextTargetIndex(null);
    }
  };

  const addTextbox = (e: React.MouseEvent) => {
    const posx = e.clientX - 50;
    const posy = e.clientY - 50;

    setTextboxes((prev) => [
      ...prev,
      { x: posx, y: posy, width: 100, height: 100 },
    ]);

    setSelectedOption("mouse");
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (contextRef.current && !contextRef.current.contains((e.target as Node))) {
        setContextPos(null);
        setContextTargetIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      className={`${selectedOption === "text" ? "cursor-text" : ""}w-screen h-screen overflow-hidden`}
      onWheel={handleWheel}
      onClick={(e) => {
        switch (selectedOption) {
          case "text":
            addTextbox(e);
        }
      }}
    >
      <div
        className="relative"
        style={{
          width: 5000,
          height: 5000,
          transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
          transformOrigin: "0, 0",
        }}
      >
        {textboxes.map((box, i) => (
          <Textbox
            key={i}
            props={box}
            handleContextMenu={(e) => handleContextMenu(e, i)}
          />
        ))}
        {contextPos && (
          <ContextMenu
            pos={contextPos}
            ref={contextRef}
            onDelete={deleteTextbox}
          />
        )}
      </div>
    </div>
  );
}

export default InfiniteCanvas;
