import { useState, useEffect } from "react";
import { GalleryCard } from "@/components/GalleryCard";
import { ImageFormDialog } from "@/components/ImageFormDialog";
import { Button } from "@/components/ui/button";

interface Template {
  id: string;
  thumbnail_url: string;
  preview: string;
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null,
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [images, setImages] = useState<Template[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          "https://hbrzlrsxxgrpebtvcxgy.supabase.co/rest/v1/rpc/get_templates_paginated",
          {
            method: "POST",
            headers: {
              "content-profile": "public",
              authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicnpscnN4eGdycGVidHZjeGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkzNzYsImV4cCI6MjA2OTAwNTM3Nn0.BcT3Qo71jmrcDS8OtPYMVsS2vvFfDbNJFo6l1jl3dtY",
              "content-type": "application/json",
              apikey:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicnpscnN4eGdycGVidHZjeGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MjkzNzYsImV4cCI6MjA2OTAwNTM3Nn0.BcT3Qo71jmrcDS8OtPYMVsS2vvFfDbNJFo6l1jl3dtY",
            },
            body: JSON.stringify({
              p_requesting_user_id: "87ca1e95-1d30-4ba7-9c96-949284e30693",
              p_page: 1,
              p_limit: 20,
              p_search: null,
              p_filter: "all",
              p_sort_by: "updated_at",
              p_sort_order: "desc",
            }),
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (image: Template) => {
    setSelectedImage(image.preview);
    setSelectedTemplateId(image.id);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
            NTV360 Flyer Request Form
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-150">
            Pick a template below and submit flyer information
          </p>
        </header>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
          {images.slice(0, visibleCount).map((image) => (
            <GalleryCard
              key={image.id}
              image={image.preview}
              onClick={() => handleImageClick(image)}
            />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < images.length && (
          <div className="text-center mt-12 animate-in fade-in slide-in-from-bottom-7 duration-1000 delay-500">
            <Button
              onClick={() => setVisibleCount(images.length)}
              size="lg"
              className="px-8 py-6 text-lg"
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Dialog */}
      {selectedImage && selectedTemplateId && (
        <ImageFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          imageSrc={selectedImage}
          templateId={selectedTemplateId}
        />
      )}
    </div>
  );
};

export default Index;
