import { forwardRef } from "react";

type ContextMenuProps = {
  pos: { x: number; y: number };
  onDelete: () => void;
};

const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ pos, onDelete }: ContextMenuProps, ref: React.Ref<HTMLDivElement>) => {
    return (
      <div
        className="absolute bg-stone-900 text-white p-2 rounded-md"
        style={{ top: pos.y, left: pos.x }}
        ref={ref}
      >
        <button
          onClick={onDelete}
          className="px-2 rounded-md hover:text-black hover:bg-white"
        >
          Delete
        </button>
      </div>
    );
  },
);

ContextMenu.displayName = "ContextMenu";

export default ContextMenu;
