"use client";

import { useCallback, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent } from "./dialog";
import { Button } from "./button";
import { Slider } from "./slider";
import { Label } from "./label";
import { Alert, AlertDescription } from "./alert";
import {
  AlertCircle,
  Crop as CropIcon,
  Loader2,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

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
    const img = imgRef.current;
    if (!img) {
      return;
    }

    const cropWidthPercent = aspectRatio >= 1 ? 80 : 80 * aspectRatio;
    const cropHeightPercent = aspectRatio <= 1 ? 80 : 80 / aspectRatio;
    const xPercent = (100 - cropWidthPercent) / 2;
    const yPercent = (100 - cropHeightPercent) / 2;

    setCrop({
      unit: "%",
      width: cropWidthPercent,
      height: cropHeightPercent,
      x: xPercent,
      y: yPercent,
    });

    // Set initial completedCrop in pixels so "Apply" works without requiring user drag
    setCompletedCrop({
      unit: "px",
      width: Math.round((cropWidthPercent / 100) * img.width),
      height: Math.round((cropHeightPercent / 100) * img.height),
      x: Math.round((xPercent / 100) * img.width),
      y: Math.round((yPercent / 100) * img.height),
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
      <DialogContent className="sm:max-w-[700px] max-h-[calc(100%-2rem)] sm:max-h-[85vh] md:max-h-[85vh] overflow-hidden p-0 gap-0 flex flex-col">
        {/* Header - pinned */}
        <div className="relative overflow-hidden p-4 sm:p-6 bg-gradient-to-br from-orange-50/50 to-pink-50/50 dark:from-white/5 dark:to-white/10 border-b border-orange-100/50 dark:border-white/10 flex-shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-orange-500/10 to-pink-500/10 dark:from-orange-400/10 dark:to-pink-400/10 blur-3xl -mr-16 -mt-16 rounded-full pointer-events-none"></div>
          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/20">
              <CropIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-muted-foreground font-medium">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          <div className="space-y-4 bg-white dark:bg-black/40 p-3 sm:p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm dark:shadow-none">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Crop Area */}
            <div className="flex justify-center items-center bg-gray-50/50 dark:bg-white/5 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 p-4">
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
                    maxHeight: "50vh",
                    maxWidth: "100%",
                  }}
                />
              </ReactCrop>
            </div>

            {/* Controls */}
            <div className="space-y-4 p-4 bg-gray-50/50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
              {/* Zoom Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <ZoomOut className="h-3.5 w-3.5" />
                    Zoom
                    <ZoomIn className="h-3.5 w-3.5" />
                  </Label>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
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
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <RotateCw className="h-3.5 w-3.5" />
                    Rotate
                  </Label>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                    {rotate}°
                  </span>
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
            </div>

            {/* Help text */}
            <div className="text-xs text-muted-foreground space-y-1 px-1">
              <p>
                Drag the corners to adjust the crop area. Final image must be
                under 1MB.
              </p>
            </div>
          </div>
        </div>

        {/* Footer - pinned */}
        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t flex-shrink-0">
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
            {isCropping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cropping...
              </>
            ) : (
              "Apply Crop"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
