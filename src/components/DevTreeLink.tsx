import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SocialNetwork } from "../types";

type DevTreeLinkProps = {
  link: SocialNetwork;
};

export default function DevTreeLink({ link }: DevTreeLinkProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: link.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="bg-white px-5 py-2 flex items-center gap-5 rou"
      {...attributes}
      {...listeners}
    >
      <div
        className="w-12 h-12 bg-cover"
        style={{
          background: `url('/social/icon_${link.name}.svg')`,
        }}
      />
      <p className="capitalize text-black">
        Visita my: <span className="font-bold text-black">{link.name}</span>
      </p>
    </li>
  );
}
