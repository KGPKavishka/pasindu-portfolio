import { CreativeWork } from "@/types/creative";
import CreativeCard from "./CreativeCard";
import Reveal from "./Reveal";

interface Props {
  works: CreativeWork[];
  onSelect: (work: CreativeWork) => void;
}

export default function CreativeGallery({
  works,
  onSelect,
}: Props) {
  return (
    <div
      className="
        columns-1
        md:columns-2
        xl:columns-3
        gap-6
      "
    >
      {works.map((work, index) => (
        <Reveal
          key={work.id}
          delay={index * 0.08}
          y={40}
        >
          <CreativeCard
            image={work.image}
            title={work.title}
            category={work.category}
            size={work.size}
            onClick={() => onSelect(work)}
          />
        </Reveal>
      ))}
    </div>
  );
}