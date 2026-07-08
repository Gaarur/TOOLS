import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Check, ExternalLink } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AdminContentAbout() {
  const { data, isLoading } = trpc.admin.cms.getContent.useQuery();
  const utils = trpc.useUtils();

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    mission: '',
    vision: '',
    imageUrl: '',
    ctaText: '',
    ctaUrl: '',
  });

  useEffect(() => {
    if (data?.about) {
      setForm({
        title: data.about.title || '',
        subtitle: data.about.subtitle || '',
        description: data.about.description || '',
        mission: data.about.mission || '',
        vision: data.about.vision || '',
        imageUrl: data.about.imageUrl || '',
        ctaText: data.about.ctaText || '',
        ctaUrl: data.about.ctaUrl || '',
      });
    }
  }, [data]);

  const updateMutation = trpc.admin.cms.updateAbout.useMutation({
    onSuccess: () => {
      toast.success('About section updated');
      utils.admin.cms.getContent.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-[500px] rounded-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">About Section</h1>
            <p className="text-muted-foreground mt-1">
              Edit the company story, mission, and vision
            </p>
          </div>
          <a
            href="/#about"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Preview
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <Card className="rounded-sm border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Header */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Section Header</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="ABOUT US & TIMELINE"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subtitle</label>
                  <Input
                    value={form.subtitle}
                    onChange={(e) => set('subtitle', e.target.value)}
                    placeholder="With 25+ years experience"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Detailed description of your company..."
                  className="min-h-28"
                />
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Mission & Vision</h2>
              <div>
                <label className="text-sm font-medium mb-2 block">Mission Statement</label>
                <Textarea
                  value={form.mission}
                  onChange={(e) => set('mission', e.target.value)}
                  placeholder="Our mission..."
                  className="min-h-24"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Vision Statement</label>
                <Textarea
                  value={form.vision}
                  onChange={(e) => set('vision', e.target.value)}
                  placeholder="Our vision..."
                  className="min-h-24"
                />
              </div>
            </div>

            {/* Image & CTA */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Media & CTA</h2>
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
                {form.imageUrl && (
                  <div className="mt-3 rounded-xl border overflow-hidden bg-muted/20 p-2">
                    <img
                      src={form.imageUrl}
                      alt="About preview"
                      className="w-full max-h-40 object-contain rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">CTA Button Text</label>
                  <Input
                    value={form.ctaText}
                    onChange={(e) => set('ctaText', e.target.value)}
                    placeholder="Learn More"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">CTA Button URL</label>
                  <Input
                    value={form.ctaUrl}
                    onChange={(e) => set('ctaUrl', e.target.value)}
                    placeholder="#about"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="min-w-32"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
              {updateMutation.isSuccess && (
                <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <Check className="h-4 w-4" />
                  Saved
                </span>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
