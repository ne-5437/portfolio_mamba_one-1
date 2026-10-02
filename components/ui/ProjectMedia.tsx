import Image from "next/image";
import PlaceholderTile from "@/components/ui/PlaceholderTile";

interface ProjectMediaProps {
  /** Project photo. When absent, the circuit placeholder tile is shown instead. */
  image?: string;
  /** Project number, used as the placeholder tile's label. */
  index: string;
}

/** Project visual: a static photo, or the circuit placeholder when none is set. */
export default function ProjectMedia({ image, index }: ProjectMediaProps) {
  if (!image) return <PlaceholderTile label={index} variant="wide" />;

  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl">
      <Image
        src={image}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
