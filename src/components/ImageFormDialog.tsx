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
import { Plus, X, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ImageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  templateId: string;
}

export const ImageFormDialog = ({
  open,
  onOpenChange,
  imageSrc,
  templateId,
}: ImageFormDialogProps) => {
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [criteria, setCriteria] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      toast.success(`${newFiles.length} file(s) selected`);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setStoreName("");
    setEmail("");
    setUrls([]);
    setCriteria("");
    setFiles([]);
  };

  const handleSubmit = async () => {
    // Validate form
    if (!storeName.trim()) {
      toast.error("Please enter store name");
      return;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (urls.every((url) => url.trim() === "") && files.length === 0) {
      toast.error("Please input URL or Upload a file");
      return;
    }

    const submitted_at = new Date().toISOString();
    const formData = new FormData();
    formData.append("id", templateId);
    formData.append("storeName", storeName);
    formData.append("email", email);
    formData.append("submitted_at", submitted_at);
    formData.append("urls", JSON.stringify(urls));
    formData.append("criteria", criteria);
    files.forEach((file) => formData.append("file", file));

    try {
      const response = await fetch(
        "https://n8n.n-compass.online/webhook-test/request-form",
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.ok) {
        onOpenChange(false);
        setShowSuccessModal(true);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting the form.");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Flyer Request Form
            </DialogTitle>
            <DialogDescription>Fill in the information below</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Thumbnail Image */}
            <div className="overflow-hidden rounded-lg border border-border">
              <img src={imageSrc} alt="Selected" className="mx-auto" />
            </div>

            {/* Store Name Section */}
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-base font-semibold">
                Store Name
              </Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter store name"
              />
            </div>

            {/* Email Section */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            {/* URLs Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="url" className="text-base font-semibold">
                  URLs
                </Label>
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
                <p className="text-sm text-muted-foreground">
                  Click "Add URL" to add a URL field
                </p>
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
              <Label htmlFor="criteria" className="text-base font-semibold">
                Criteria
              </Label>
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
              <Label htmlFor="file" className="text-base font-semibold">
                Upload File
              </Label>
              <div className="flex items-start gap-3">
                <Button
                  type="button"
                  onClick={() => document.getElementById("file-input")?.click()}
                  variant="outline"
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </Button>
                <div className="flex-1 space-y-2">
                  {files.length > 0 ? (
                    files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 p-2 rounded-md"
                      >
                        <span className="truncate pr-2">{file.name}</span>
                        <Button
                          type="button"
                          onClick={() => removeFile(index)}
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 shrink-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground pt-2">
                      No files selected
                    </p>
                  )}
                </div>
              </div>
              <input
                id="file-input"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
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
      <Dialog open={showSuccessModal} onOpenChange={handleSuccessModalClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center space-y-4 py-8">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Request Submitted</h2>
            <p className="text-muted-foreground">
              Please check your email for updates.
            </p>
            <Button onClick={handleSuccessModalClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
