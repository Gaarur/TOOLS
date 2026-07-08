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
  Loader2,
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type FaqForm = {
  id?: number;
  question: string;
  answer: string;
  displayOrder: number;
};

const emptyForm: FaqForm = {
  question: '',
  answer: '',
  displayOrder: 0,
};

export default function AdminContentFaq() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FaqForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: faqList = [], isLoading } =
    trpc.admin.cms.listFaqs.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.admin.cms.createFaq.useMutation({
    onSuccess: () => {
      toast.success('FAQ added');
      utils.admin.cms.listFaqs.invalidate();
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.cms.updateFaq.useMutation({
    onSuccess: () => {
      toast.success('FAQ updated');
      utils.admin.cms.listFaqs.invalidate();
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.cms.deleteFaq.useMutation({
    onSuccess: () => {
      toast.success('FAQ removed');
      utils.admin.cms.listFaqs.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setForm(emptyForm);
    setIsEditing(false);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, displayOrder: faqList.length });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (item: any) => {
    setForm({
      id: item.id,
      question: item.question || '',
      answer: item.answer || '',
      displayOrder: item.displayOrder ?? 0,
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && form.id) {
      updateMutation.mutate(form as FaqForm & { id: number });
    } else {
      const { id, ...rest } = form;
      createMutation.mutate(rest);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this FAQ?')) {
      deleteMutation.mutate({ id });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage FAQ entries shown on the landing page
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add FAQ
          </Button>
        </div>

        {/* FAQ List */}
        {faqList.length === 0 ? (
          <Card className="rounded-sm border p-12 text-center">
            <HelpCircle className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium mb-1">No FAQs yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add common questions and answers for your visitors
            </p>
            <Button onClick={openCreate} variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add FAQ
            </Button>
          </Card>
        ) : (
          <div className="space-y-2">
            {faqList.map((faq: any) => (
              <div
                key={faq.id}
                className="rounded-xl border border-border bg-card overflow-hidden transition-shadow hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(expandedId === faq.id ? null : faq.id)
                  }
                  className="flex w-full items-center gap-3 p-4 text-left"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-xs font-semibold text-primary">
                    {faq.displayOrder + 1}
                  </div>
                  <p className="flex-1 font-medium text-sm">{faq.question}</p>
                  {expandedId === faq.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {expandedId === faq.id && (
                  <div className="border-t px-4 py-3 bg-muted/20">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-3">
                      {faq.answer}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(faq)}
                        className="h-7 gap-1 text-xs"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(faq.id)}
                        className="h-7 gap-1 text-xs text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit FAQ' : 'Add New FAQ'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Question
                </label>
                <Input
                  value={form.question}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, question: e.target.value }))
                  }
                  placeholder="What services do you offer?"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Answer</label>
                <Textarea
                  value={form.answer}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, answer: e.target.value }))
                  }
                  placeholder="Detailed answer..."
                  className="min-h-32"
                  required
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
                <Button type="submit" disabled={isSaving} className="min-w-28">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    'Update FAQ'
                  ) : (
                    'Add FAQ'
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
