import { Card } from "@/components/ui/card";

interface GalleryCardProps {
  image: string;
  onClick: () => void;
}

export const GalleryCard = ({ image, onClick }: GalleryCardProps) => {
  return (
    <Card
      className="group overflow-hidden cursor-pointer border-border transition-all duration-300 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="overflow-hidden bg-muted">
        <img
          src={image}
          alt="Gallery thumbnail"
          className="mx-auto transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </Card>
  );
};
