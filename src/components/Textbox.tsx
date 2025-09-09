import { useEffect, useRef, useState } from "react";
import Tiptap from "./Tiptap";

type Position = [number, number];

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type TextboxProps = {
  props: Box;
  handleContextMenu: (e: React.MouseEvent) => void;
};


function Textbox({ props, handleContextMenu }: TextboxProps) {
  const [box, setBox] = useState<Box>(props);
  const [selected, setSelected] = useState<boolean>(true);

  const isDraging = useRef(false);
  const offset = useRef<Position>([0, 0]);
  const boxRef = useRef<HTMLDivElement>(null);
  const resizeHandle = useRef<null | string>(null);

  const startDrag = (e: React.MouseEvent) => {
    e.stopPropagation();

    window.addEventListener("mousemove", drag);
    window.addEventListener("mouseup", stopDrag);

    isDraging.current = true;
    offset.current = [e.clientX - box.x, e.clientY - box.y];
  };

  const drag = (e: MouseEvent) => {
    if (!isDraging.current) return;
    setBox((prev) => ({
      ...prev,
      x: e.clientX - offset.current[0],
      y: e.clientY - offset.current[1],
    }));
  };

  const stopDrag = () => {
    isDraging.current = false;

    window.removeEventListener("mousemove", drag);
    window.removeEventListener("mouseup", stopDrag);
  };

  const startResize = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    resizeHandle.current = handle;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  };

  const stopResize = () => {
    resizeHandle.current = null;
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  };

  const resize = (e: MouseEvent) => {
    if (!resizeHandle.current) return;
    setBox((prev) => {
      let { x, y, width, height } = prev;

      switch (resizeHandle.current) {
        case "bottom":
          height = e.clientY - y;
          break;

        case "right":
          width = e.clientX - x;
          break;

        case "left":
          width = width + (x - e.clientX);
          x = e.clientX;
          break;

        case "bottomRight":
          width = e.clientX - x;
          height = e.clientY - y;
          break;

        case "bottomLeft":
          width = width + (x - e.clientX);
          height = e.clientY - y;
          x = e.clientX;
          break;

        case "topRight":
          height = height + (y - e.clientY);
          width = e.clientX - x;
          y = e.clientY;
          break;

        case "topLeft":
          width = width + (x - e.clientX);
          height = height + (y - e.clientY);
          y = e.clientY;
          x = e.clientX;
          break;
      }

      return { x, y, width, height };
    });
  };

  useEffect(() => {
    const deselect = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setSelected(false);
      }
    };

    document.addEventListener("mousedown", deselect);

    return () => {
      document.removeEventListener("mousedown", deselect);
    };
  });

  return (
    <div
      className={`absolute border-2 border-t-8 ${selected ? "border-stone-700" : "border-transparent"} hover:border-stone-700`}
      style={{
        left: box.x,
        top: box.y,
        minHeight: box.height,
        width: box.width,
        height: "auto",
      }}
      onClick={() => setSelected(true)}
      ref={boxRef}
    >
      <div
        className="absolute w-[80%] h-2 left-[10%] -top-2 hover:cursor-grab"
        onMouseDown={startDrag}
      ></div>
      <div
        className="absolute w-[80%] h-1 left-[10%] -bottom-0.5 hover:cursor-ns-resize"
        onMouseDown={(e) => startResize("bottom", e)}
      ></div>
      <div
        className="absolute h-[80%] w-1 top-[10%] -left-0.5 hover:cursor-ew-resize"
        onMouseDown={(e) => startResize("left", e)}
      ></div>
      <div
        className="absolute h-[80%] w-1 top-[10%] -right-0.5 hover:cursor-ew-resize"
        onMouseDown={(e) => startResize("right", e)}
      ></div>

      <div
        className="absolute w-2 h-2 -top-1 -left-1 hover:cursor-nwse-resize"
        onMouseDown={(e) => startResize("topLeft", e)}
      ></div>
      <div
        className="absolute w-2 h-2 -top-1 -right-1 hover:cursor-nesw-resize"
        onMouseDown={(e) => startResize("topRight", e)}
      ></div>
      <div
        className="absolute w-2 h-2 -bottom-1 -left-1 hover:cursor-nesw-resize"
        onMouseDown={(e) => startResize("bottomLeft", e)}
      ></div>
      <div
        className="absolute w-2 h-2 -bottom-1 -right-1 hover:cursor-nwse-resize"
        onMouseDown={(e) => startResize("bottomRight", e)}
      ></div>
      <Tiptap selected={selected} size={{width: 100, height:100 }} onContextMenu={handleContextMenu}/>
    </div>
  );
}

export default Textbox;
