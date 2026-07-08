import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Settings,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type ServiceForm = {
  id?: number;
  title: string;
  shortDescription: string;
  longDescription: string;
  icon: string;
  displayOrder: number;
  status: string;
  imageUrl: string;
};

const emptyForm: ServiceForm = {
  title: '',
  shortDescription: '',
  longDescription: '',
  icon: 'Settings',
  displayOrder: 0,
  status: 'active',
  imageUrl: '',
};

const ICON_OPTIONS = [
  'Settings',
  'Wrench',
  'Cog',
  'Factory',
  'Hammer',
  'Layers',
  'Shield',
  'Zap',
  'Target',
  'Package',
  'Ruler',
  'Box',
];

export default function AdminContentServices() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  const { data: servicesList = [], isLoading } =
    trpc.admin.cms.listServices.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.admin.cms.createService.useMutation({
    onSuccess: () => {
      toast.success('Service created');
      utils.admin.cms.listServices.invalidate();
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.cms.updateService.useMutation({
    onSuccess: () => {
      toast.success('Service updated');
      utils.admin.cms.listServices.invalidate();
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.cms.deleteService.useMutation({
    onSuccess: () => {
      toast.success('Service deleted');
      utils.admin.cms.listServices.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setForm(emptyForm);
    setIsEditing(false);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, displayOrder: servicesList.length });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (service: any) => {
    setForm({
      id: service.id,
      title: service.title || '',
      shortDescription: service.shortDescription || '',
      longDescription: service.longDescription || '',
      icon: service.icon || 'Settings',
      displayOrder: service.displayOrder ?? 0,
      status: service.status || 'active',
      imageUrl: service.imageUrl || '',
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && form.id) {
      updateMutation.mutate(form as ServiceForm & { id: number });
    } else {
      const { id, ...rest } = form;
      createMutation.mutate(rest);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
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
              <Skeleton key={i} className="h-20 rounded-xl" />
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
            <h1 className="text-3xl font-bold tracking-tight">Services</h1>
            <p className="text-muted-foreground mt-1">
              Manage the services displayed on your landing page
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Service
          </Button>
        </div>

        {/* Service List */}
        {servicesList.length === 0 ? (
          <Card className="rounded-sm border p-12 text-center">
            <Settings className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium mb-1">No services yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first service to showcase on the landing page
            </p>
            <Button onClick={openCreate} variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {servicesList.map((service: any) => (
              <div
                key={service.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-medium truncate">{service.title}</p>
                    <span
                      className={`shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-medium ${
                        service.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-gray-500/10 text-gray-500'
                      }`}
                    >
                      {service.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {service.shortDescription}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(service)}
                    className="h-8 w-8 p-0"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(service.id)}
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
                {isEditing ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="Plastic Injection Moulds"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Short Description
                </label>
                <Input
                  value={form.shortDescription}
                  onChange={(e) => set('shortDescription', e.target.value)}
                  placeholder="Brief one-line summary..."
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Long Description
                </label>
                <Textarea
                  value={form.longDescription}
                  onChange={(e) => set('longDescription', e.target.value)}
                  placeholder="Detailed description of this service..."
                  className="min-h-28"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Icon</label>
                  <Select
                    value={form.icon}
                    onValueChange={(val) => set('icon', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select
                    value={form.status}
                    onValueChange={(val) => set('status', val)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) => set('displayOrder', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Image URL{' '}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Input
                    value={form.imageUrl}
                    onChange={(e) => set('imageUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="min-w-28">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    'Update Service'
                  ) : (
                    'Create Service'
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
