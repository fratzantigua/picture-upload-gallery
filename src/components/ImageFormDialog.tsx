import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";

interface ImageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
}

export const ImageFormDialog = ({ open, onOpenChange, imageSrc }: ImageFormDialogProps) => {
  const [urls, setUrls] = useState<string[]>([]);
  const [criteria, setCriteria] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const addUrl = () => {
    setUrls([...urls, ""]);
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success("File selected: " + e.target.files[0].name);
    }
  };

  const handleSubmit = () => {
    // Validate form
    if (urls.some(url => url.trim() === "")) {
      toast.error("Please fill in all URL fields or remove empty ones");
      return;
    }
    if (!criteria.trim()) {
      toast.error("Please enter criteria");
      return;
    }
    if (!file) {
      toast.error("Please upload a file");
      return;
    }

    // Process form data
    console.log({ urls, criteria, file });
    toast.success("Form submitted successfully!");
    
    // Reset form
    setUrls([""]);
    setCriteria("");
    setFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Image Details
          </DialogTitle>
          <DialogDescription>
            Fill in the information below for this image
          </DialogDescription>
        </DialogHeader>

        <div className="aspect-video w-full overflow-hidden rounded-lg border border-border mb-6">
          <img 
            src={imageSrc} 
            alt="Selected" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          {/* URLs Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="url" className="text-base font-semibold">URLs</Label>
              <Button
                type="button"
                onClick={addUrl}
                size="sm"
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add URL
              </Button>
            </div>
            {urls.length === 0 && (
              <p className="text-sm text-muted-foreground">Click "Add URL" to add a URL field</p>
            )}
            {urls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => updateUrl(index, e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={() => removeUrl(index)}
                  size="icon"
                  variant="ghost"
                  className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Criteria Section */}
          <div className="space-y-2">
            <Label htmlFor="criteria" className="text-base font-semibold">Criteria</Label>
            <Textarea
              id="criteria"
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              placeholder="Enter your criteria here..."
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-base font-semibold">Upload File</Label>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => document.getElementById('file-input')?.click()}
                variant="outline"
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              {file && (
                <span className="text-sm text-muted-foreground truncate flex-1">
                  {file.name}
                </span>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            size="lg"
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
