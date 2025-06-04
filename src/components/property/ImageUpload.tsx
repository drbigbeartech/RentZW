import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Star } from "lucide-react";
import { toast } from "react-hot-toast";

interface ImageFile {
  file: File;
  preview: string;
  id: string;
  isPrimary?: boolean;
}

interface ImageUploadProps {
  onImagesChange: (images: ImageFile[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
  initialImages?: ImageFile[];
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  maxImages = 5,
  maxSize = 10,
  initialImages = [],
  disabled = false,
}) => {
  const [images, setImages] = useState<ImageFile[]>(initialImages);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload only image files");
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return false;
    }

    // Check supported formats
    const supportedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!supportedFormats.includes(file.type)) {
      toast.error("Please upload JPEG, PNG, or WebP images only");
      return false;
    }

    return true;
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const createImageFile = (file: File): ImageFile => ({
    file,
    preview: URL.createObjectURL(file),
    id: generateId(),
    isPrimary: images.length === 0, // First image is primary by default
  });

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);

      if (images.length + fileArray.length > maxImages) {
        toast.error(`You can upload a maximum of ${maxImages} images`);
        return;
      }

      const validFiles = fileArray.filter(validateFile);
      if (validFiles.length === 0) return;

      const newImages = validFiles.map(createImageFile);
      const updatedImages = [...images, ...newImages];

      setImages(updatedImages);
      onImagesChange(updatedImages);
    },
    [images, maxImages, onImagesChange],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles, disabled],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    const updatedImages = images.filter((img) => img.id !== id);

    // If we removed the primary image, make the first remaining image primary
    if (imageToRemove?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }

    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const setPrimaryImage = (id: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));

    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
            disabled={disabled || images.length >= maxImages}
          />

          <Upload className="h-12 w-12 text-gray-400 mb-4" />

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Upload Property Images
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop images here, or{" "}
              <label
                htmlFor="image-upload"
                className={`text-blue-600 hover:text-blue-500 font-medium ${
                  disabled || images.length >= maxImages
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                browse files
              </label>
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Maximum {maxImages} images</p>
              <p>• Maximum {maxSize}MB per image</p>
              <p>• JPEG, PNG, or WebP format</p>
              <p>• First image will be the primary image</p>
            </div>
          </div>

          {images.length < maxImages && !disabled && (
            <Button type="button" className="mt-4" asChild>
              <label htmlFor="image-upload">
                <Upload className="h-4 w-4 mr-2" />
                Choose Files
              </label>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <Card key={image.id} className="relative group overflow-hidden">
              <div className="aspect-square">
                <img
                  src={image.preview}
                  alt={`Property image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-between items-start">
                  {image.isPrimary && (
                    <Badge variant="default" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Primary
                    </Badge>
                  )}

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeImage(image.id)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex justify-center">
                  {!image.isPrimary && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="text-xs"
                      onClick={() => setPrimaryImage(image.id)}
                      disabled={disabled}
                    >
                      Set as Primary
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Progress Info */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {images.length} of {maxImages} images uploaded
          </span>
          <span>
            {images.find((img) => img.isPrimary) && (
              <Badge variant="outline" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                Primary image set
              </Badge>
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
