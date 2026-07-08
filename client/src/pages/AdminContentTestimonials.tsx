import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  MessageSquare,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type TestimonialForm = {
  id?: number;
  clientName: string;
  company: string;
  photoUrl: string;
  review: string;
  rating: number;
  visible: number;
  displayOrder: number;
};

const emptyForm: TestimonialForm = {
  clientName: '',
  company: '',
  photoUrl: '',
  review: '',
  rating: 5,
  visible: 1,
  displayOrder: 0,
};

export default function AdminContentTestimonials() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<TestimonialForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  const { data: testimonialList = [], isLoading } =
    trpc.admin.cms.listTestimonials.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.admin.cms.createTestimonial.useMutation({
    onSuccess: () => {
      toast.success('Testimonial added');
      utils.admin.cms.listTestimonials.invalidate();
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.cms.updateTestimonial.useMutation({
    onSuccess: () => {
      toast.success('Testimonial updated');
      utils.admin.cms.listTestimonials.invalidate();
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.cms.deleteTestimonial.useMutation({
    onSuccess: () => {
      toast.success('Testimonial removed');
      utils.admin.cms.listTestimonials.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setForm(emptyForm);
    setIsEditing(false);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, displayOrder: testimonialList.length });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setForm({
      id: item.id,
      clientName: item.clientName || '',
      company: item.company || '',
      photoUrl: item.photoUrl || '',
      review: item.review || '',
      rating: item.rating ?? 5,
      visible: item.visible ?? 1,
      displayOrder: item.displayOrder ?? 0,
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && form.id) {
      updateMutation.mutate(form as TestimonialForm & { id: number });
    } else {
      const { id, ...rest } = form;
      createMutation.mutate(rest);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this testimonial?')) {
      deleteMutation.mutate({ id });
    }
  };

  const set = (key: string, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
            <p className="text-muted-foreground mt-1">
              Manage client reviews and testimonials
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Button>
        </div>

        {/* List */}
        {testimonialList.length === 0 ? (
          <Card className="rounded-sm border p-12 text-center">
            <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium mb-1">No testimonials yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add client reviews to build trust on your landing page
            </p>
            <Button onClick={openCreate} variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Testimonial
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {testimonialList.map((item: any) => (
              <div
                key={item.id}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
              >
                {item.photoUrl ? (
                  <img
                    src={item.photoUrl}
                    alt={item.clientName}
                    className="h-11 w-11 rounded-sm object-cover border shrink-0"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-sm bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {item.clientName?.charAt(0)?.toUpperCase() ?? '?'}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{item.clientName}</p>
                    {item.company && (
                      <span className="text-xs text-muted-foreground">
                        â€” {item.company}
                      </span>
                    )}
                    {item.visible ? (
                      <Eye className="h-3 w-3 text-emerald-500 shrink-0" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-muted-foreground shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < item.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    "{item.review}"
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(item)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Testimonial' : 'Add Testimonial'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Client Name
                  </label>
                  <Input
                    value={form.clientName}
                    onChange={(e) => set('clientName', e.target.value)}
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Company{' '}
                    <span className="text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <Input
                    value={form.company}
                    onChange={(e) => set('company', e.target.value)}
                    placeholder="Acme Corp"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Review</label>
                <Textarea
                  value={form.review}
                  onChange={(e) => set('review', e.target.value)}
                  placeholder="What the client said about your services..."
                  className="min-h-28"
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Rating (1-5)
                  </label>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => set('rating', star)}
                        className="p-0.5"
                      >
                        <Star
                          className={`h-5 w-5 transition-colors ${
                            star <= form.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) =>
                      set('displayOrder', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Photo URL
                  </label>
                  <Input
                    value={form.photoUrl}
                    onChange={(e) => set('photoUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* Visibility */}
              <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  {form.visible ? (
                    <Eye className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">
                    {form.visible
                      ? 'Visible on landing page'
                      : 'Hidden from visitors'}
                  </span>
                </div>
                <Switch
                  checked={form.visible === 1}
                  onCheckedChange={(checked) =>
                    set('visible', checked ? 1 : 0)
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="min-w-28">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    'Update'
                  ) : (
                    'Add Testimonial'
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
