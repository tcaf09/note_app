import { useEffect, useRef, useState } from "react";
import Tiptap from "./Tiptap";
import { type JSONContent } from "@tiptap/react";

type Position = [number, number];

type Box = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number | "auto";
  content: JSONContent;
};

type TextboxProps = {
  props: Box;
  handleContextMenu: (e: React.MouseEvent) => void;
  onChange: (id: string, content: JSONContent) => void;
  onResize: (id: string, update: Partial<Box>) => void;
};

function Textbox({
  props,
  handleContextMenu,
  onChange,
  onResize,
}: TextboxProps) {
  const [box, setBox] = useState<Box>(props);
  const [selected, setSelected] = useState<boolean>(true);

  const isDraging = useRef(false);
  const offset = useRef<Position>([0, 0]);
  const boxRef = useRef<HTMLDivElement>(null);
  const resizeHandle = useRef<null | string>(null);

  const startDrag = (e: React.PointerEvent) => {
    e.stopPropagation();

    window.addEventListener("pointermove", drag);
    window.addEventListener("pointerup", stopDrag);

    isDraging.current = true;
    offset.current = [e.clientX - box.x, e.clientY - box.y];
  };

  const drag = (e: PointerEvent) => {
    if (!isDraging.current) return;
    setBox((prev) => ({
      ...prev,
      x: e.clientX - offset.current[0],
      y: e.clientY - offset.current[1],
    }));
  };

  const stopDrag = () => {
    isDraging.current = false;

    window.removeEventListener("pointermove", drag);
    window.removeEventListener("pointerup", stopDrag);

    setBox((prev) => {
      onResize(prev.id, {
        x: prev.x,
        y: prev.y,
      });

      return prev;
    });
  };

  const startResize = (handle: string, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    resizeHandle.current = handle;
    document.addEventListener("pointermove", resize);
    document.addEventListener("pointerup", stopResize);
  };

  const stopResize = () => {
    resizeHandle.current = null;
    document.removeEventListener("pointermove", resize);
    document.removeEventListener("pointerup", stopResize);
    setBox((prev) => {
      onResize(prev.id, {
        width: prev.width,
        height: prev.height,
        x: prev.x,
        y: prev.y,
      });

      return prev;
    });
  };

  const resize = (e: PointerEvent) => {
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
          height = (height as number) + (y - e.clientY);
          width = e.clientX - x;
          y = e.clientY;
          break;

        case "topLeft":
          width = width + (x - e.clientX);
          height = (height as number) + (y - e.clientY);
          y = e.clientY;
          x = e.clientX;
          break;
      }

      return { ...prev, x, y, width, height };
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
      className={`absolute border-2 border-t-8 ${selected ? "border-stone-700" : "border-transparent"
        } hover:border-stone-700`}
      style={{
        left: box.x,
        top: box.y,
        minHeight: box.height,
        width: box.width,
        height: "auto",
      }}
      onContextMenu={handleContextMenu}
      onClick={() => setSelected(true)}
      ref={boxRef}
    >
      <div
        className="absolute w-[80%] h-2 left-[10%] -top-2 hover:cursor-grab"
        onPointerDown={startDrag}
      ></div>
      <div
        className="absolute w-[80%] h-1 left-[10%] -bottom-0.5 hover:cursor-ns-resize"
        onPointerDown={(e) => startResize("bottom", e)}
      ></div>
      <div
        className="absolute h-[80%] w-1 top-[10%] -left-0.5 hover:cursor-ew-resize"
        onPointerDown={(e) => startResize("left", e)}
      ></div>
      <div
        className="absolute h-[80%] w-1 top-[10%] -right-0.5 hover:cursor-ew-resize"
        onPointerDown={(e) => startResize("right", e)}
      ></div>

      <div
        className="absolute w-2 h-2 -top-1 -left-1 hover:cursor-nwse-resize"
        onPointerDown={(e) => startResize("topLeft", e)}
      ></div>
      <div
        className="absolute w-2 h-2 -top-1 -right-1 hover:cursor-nesw-resize"
        onPointerDown={(e) => startResize("topRight", e)}
      ></div>
      <div
        className="absolute w-2 h-2 -bottom-1 -left-1 hover:cursor-nesw-resize"
        onPointerDown={(e) => startResize("bottomLeft", e)}
      ></div>
      <div
        className="absolute w-2 h-2 -bottom-1 -right-1 hover:cursor-nwse-resize"
        onPointerDown={(e) => startResize("bottomRight", e)}
      ></div>
      <Tiptap selected={selected} onChange={onChange} box={box} />
    </div>
  );
}

export default Textbox;
