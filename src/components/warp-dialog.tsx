import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function WarpDialog({ openWarp, onOpenChange }: any) {
  if (!openWarp) return null;

  return (
    <Dialog open={!!openWarp} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full max-w-5xl max-h-[90vh] p-0 overflow-hidden rounded-3xl border border-white/20 bg-gray-900/95 backdrop-blur-2xl"
      >
        <div className="flex flex-col md:flex-row h-full w-full">
          {/* Image Section */}
          <div className="md:w-2/3 w-full bg-black flex items-center justify-center">
            <img
              src={openWarp.imageUrl}
              alt={openWarp.name}
              className="object-contain w-full h-full max-h-[90vh]"
              loading="lazy"
            />
          </div>

          {/* Details Section */}
          <div className="md:w-1/3 w-full flex flex-col justify-between p-6 bg-gray-950">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                {openWarp.name}
              </h2>
              <p className="text-sm text-gray-300 mb-4 line-clamp-6">
                {openWarp.description}
              </p>
            </div>
            <div className="flex space-x-3 mt-auto">
              <Button variant="secondary" className="flex items-center gap-2 w-full">
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              <Button variant="default" className="flex items-center gap-2 w-full">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
