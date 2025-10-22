import { useState } from "react";
import { GalleryCard } from "@/components/GalleryCard";
import { ImageFormDialog } from "@/components/ImageFormDialog";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const images = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6];

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Image Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Click on any image to view details and submit related information
          </p>
        </header>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          {images.map((image, index) => (
            <GalleryCard
              key={index}
              image={image}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>
      </div>

      {/* Dialog */}
      {selectedImage && (
        <ImageFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          imageSrc={selectedImage}
        />
      )}
    </div>
  );
};

export default Index;
