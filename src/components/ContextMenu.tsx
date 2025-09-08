type Pos = {
  x: number;
  y: number;
};

function ContextMenu({ pos }: { pos: Pos }) {
  return (
    <div
      className="absolute bg-stone-900"
      style={{top: pos.y, left: pos.x}}
    ></div>
  );
}

export default ContextMenu;
