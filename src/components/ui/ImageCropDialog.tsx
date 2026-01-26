"use client";

import { useCallback, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Slider } from "./slider";
import { Label } from "./label";
import { Alert, AlertDescription } from "./alert";
import { AlertCircle, ZoomIn, ZoomOut } from "lucide-react";

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob, croppedImageUrl: string) => void;
  aspectRatio?: number;
  circularCrop?: boolean;
  title?: string;
  description?: string;
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onCropComplete,
  aspectRatio = 1,
  circularCrop = false,
  title = "Crop Image",
  description = "Adjust the crop area to your preference",
}: ImageCropDialogProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 80,
    height: 80,
    x: 10,
    y: 10,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState(false);

  const handleImageLoad = useCallback(() => {
    const cropWidthPercent = aspectRatio >= 1 ? 80 : 80 * aspectRatio;
    const cropHeightPercent = aspectRatio <= 1 ? 80 : 80 / aspectRatio;

    setCrop({
      unit: "%",
      width: cropWidthPercent,
      height: cropHeightPercent,
      x: (100 - cropWidthPercent) / 2,
      y: (100 - cropHeightPercent) / 2,
    });
  }, [aspectRatio]);

  const getCroppedImg = useCallback(
    async (
      image: HTMLImageElement,
      pixelCrop: PixelCrop,
      rotation = 0
    ): Promise<{ blob: Blob; url: string }> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No 2d context");
      }

      // Calculate scale factors from displayed size to natural size
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      // The pixelCrop coordinates are based on the CSS-scaled image display
      // We need to account for the CSS scale when converting to natural coordinates
      const effectiveScaleX = scaleX / scale;
      const effectiveScaleY = scaleY / scale;

      // Calculate the crop dimensions in natural image pixels
      const naturalCropWidth = pixelCrop.width * effectiveScaleX;
      const naturalCropHeight = pixelCrop.height * effectiveScaleY;
      const naturalCropX = pixelCrop.x * effectiveScaleX;
      const naturalCropY = pixelCrop.y * effectiveScaleY;

      // Set canvas size to natural crop dimensions
      canvas.width = naturalCropWidth;
      canvas.height = naturalCropHeight;

      // Apply rotation around center
      ctx.save();
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      // Draw the cropped portion from the natural image
      ctx.drawImage(
        image,
        naturalCropX,
        naturalCropY,
        naturalCropWidth,
        naturalCropHeight,
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.restore();

      // Convert canvas to blob
      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Canvas is empty"));
              return;
            }
            const url = URL.createObjectURL(blob);
            resolve({ blob, url });
          },
          "image/jpeg",
          0.95
        );
      });
    },
    [scale]
  );

  const handleCropConfirm = async () => {
    if (!completedCrop || !imgRef.current) {
      setError("Please select a crop area");
      return;
    }

    setIsCropping(true);
    setError(null);

    try {
      const { blob, url } = await getCroppedImg(
        imgRef.current,
        completedCrop,
        rotate
      );

      // Validate file size (1MB = 1048576 bytes)
      const maxSize = 1048576;
      if (blob.size > maxSize) {
        setError(
          `Image size (${(blob.size / 1024 / 1024).toFixed(2)}MB) exceeds 1MB limit. Try reducing the crop area.`
        );
        setIsCropping(false);
        return;
      }

      onCropComplete(blob, url);
      onOpenChange(false);

      // Reset state
      setScale(1);
      setRotate(0);
      setError(null);
    } catch (e) {
      console.error("Error cropping image:", e);
      setError("Failed to crop image. Please try again.");
    } finally {
      setIsCropping(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setScale(1);
    setRotate(0);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              circularCrop={circularCrop}
            >
              <img
                ref={imgRef}
                alt="Crop preview"
                src={imageSrc}
                onLoad={handleImageLoad}
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxHeight: "60vh",
                  maxWidth: "100%",
                }}
              />
            </ReactCrop>
          </div>

          {/* Zoom Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium flex items-center gap-2">
                <ZoomOut className="h-4 w-4" />
                Zoom
                <ZoomIn className="h-4 w-4" />
              </Label>
              <span className="text-xs text-muted-foreground">
                {Math.round(scale * 100)}%
              </span>
            </div>
            <Slider
              value={[scale]}
              onValueChange={(value) => setScale(value[0])}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Rotate Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Rotate</Label>
              <span className="text-xs text-muted-foreground">{rotate}°</span>
            </div>
            <Slider
              value={[rotate]}
              onValueChange={(value) => setRotate(value[0])}
              min={-180}
              max={180}
              step={1}
              className="w-full"
            />
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Drag the corners to adjust the crop area</p>
            <p>• Final image must be under 1MB</p>
            <p>• Supported formats: JPG, PNG, WebP</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isCropping}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCropConfirm}
            disabled={isCropping}
          >
            {isCropping ? "Cropping..." : "Apply Crop"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
