import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type GalleryForm = {
  imageUrl: string;
  caption: string;
  displayOrder: number;
};

const emptyForm: GalleryForm = {
  imageUrl: '',
  caption: '',
  displayOrder: 0,
};

export default function AdminContentGallery() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<GalleryForm>(emptyForm);

  const { data: galleryList = [], isLoading } =
    trpc.admin.cms.listGallery.useQuery();
  const utils = trpc.useUtils();

  const addMutation = trpc.admin.cms.addGalleryImage.useMutation({
    onSuccess: () => {
      toast.success('Image added to gallery');
      utils.admin.cms.listGallery.invalidate();
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.cms.deleteGalleryImage.useMutation({
    onSuccess: () => {
      toast.success('Image removed');
      utils.admin.cms.listGallery.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, displayOrder: galleryList.length });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(form);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Remove this image from the gallery?')) {
      deleteMutation.mutate({ id });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
            <p className="text-muted-foreground mt-1">
              Manage project images and photos â€” {galleryList.length} images
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Image
          </Button>
        </div>

        {/* Gallery Grid */}
        {galleryList.length === 0 ? (
          <Card className="rounded-sm border p-12 text-center">
            <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium mb-1">Gallery is empty</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add images to showcase your work
            </p>
            <Button onClick={openCreate} variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Image
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryList.map((img: any) => (
              <div
                key={img.id}
                className="group relative aspect-square rounded-xl border border-border overflow-hidden bg-muted/20"
              >
                <img
                  src={img.imageUrl}
                  alt={img.caption || 'Gallery image'}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f1f5f9" width="100" height="100"/><text x="50%" y="50%" fill="%2394a3b8" font-size="12" text-anchor="middle" dominant-baseline="central">No image</text></svg>';
                  }}
                />
                {img.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                    <p className="text-xs text-white truncate">{img.caption}</p>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(img.id)}
                  className="absolute top-2 right-2 h-8 w-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
                >
                  <Trash2 className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Image Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Image URL
                </label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, imageUrl: e.target.value }))
                  }
                  placeholder="https://..."
                  required
                />
                {form.imageUrl && (
                  <div className="mt-3 rounded-xl border overflow-hidden bg-muted/20 p-2">
                    <img
                      src={form.imageUrl}
                      alt="Preview"
                      className="w-full max-h-48 object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Caption{' '}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <Input
                  value={form.caption}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, caption: e.target.value }))
                  }
                  placeholder="Describe the image..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Display Order
                </label>
                <Input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      displayOrder: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addMutation.isPending}
                  className="min-w-28"
                >
                  {addMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Image'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
