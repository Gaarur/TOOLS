import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Check, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AdminContentHero() {
  const { data, isLoading } = trpc.admin.cms.getContent.useQuery();
  const utils = trpc.useUtils();

  const [form, setForm] = useState({
    heading: '',
    subheading: '',
    primaryBtnText: '',
    primaryBtnUrl: '',
    secondaryBtnText: '',
    secondaryBtnUrl: '',
    heroImageUrl: '',
    backgroundImageUrl: '',
    visible: 1,
  });

  useEffect(() => {
    if (data?.hero) {
      setForm({
        heading: data.hero.heading || '',
        subheading: data.hero.subheading || '',
        primaryBtnText: data.hero.primaryBtnText || '',
        primaryBtnUrl: data.hero.primaryBtnUrl || '',
        secondaryBtnText: data.hero.secondaryBtnText || '',
        secondaryBtnUrl: data.hero.secondaryBtnUrl || '',
        heroImageUrl: data.hero.heroImageUrl || '',
        backgroundImageUrl: data.hero.backgroundImageUrl || '',
        visible: data.hero.visible ?? 1,
      });
    }
  }, [data]);

  const updateMutation = trpc.admin.cms.updateHero.useMutation({
    onSuccess: () => {
      toast.success('Hero section updated');
      utils.admin.cms.getContent.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(form);
  };

  const set = (key: string, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-[600px] rounded-sm" />
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
            <h1 className="text-3xl font-bold tracking-tight">Hero Section</h1>
            <p className="text-muted-foreground mt-1">
              Manage the main banner area of your landing page
            </p>
          </div>
          <a
            href="/"
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
            {/* Visibility */}
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-3">
                {form.visible ? (
                  <Eye className="h-4 w-4 text-emerald-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">Section Visibility</p>
                  <p className="text-xs text-muted-foreground">
                    {form.visible
                      ? 'Hero section is visible on the landing page'
                      : 'Hero section is hidden from visitors'}
                  </p>
                </div>
              </div>
              <Switch
                checked={form.visible === 1}
                onCheckedChange={(checked) => set('visible', checked ? 1 : 0)}
              />
            </div>

            {/* Content */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Content</h2>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Heading
                </label>
                <Input
                  value={form.heading}
                  onChange={(e) => set('heading', e.target.value)}
                  placeholder="Main hero heading..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Subheading
                </label>
                <Textarea
                  value={form.subheading}
                  onChange={(e) => set('subheading', e.target.value)}
                  placeholder="Supporting text beneath the heading..."
                  className="min-h-24"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Call to Action Buttons</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Primary Button Text
                  </label>
                  <Input
                    value={form.primaryBtnText}
                    onChange={(e) => set('primaryBtnText', e.target.value)}
                    placeholder="Get Started"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Primary Button URL
                  </label>
                  <Input
                    value={form.primaryBtnUrl}
                    onChange={(e) => set('primaryBtnUrl', e.target.value)}
                    placeholder="#contact"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Secondary Button Text
                  </label>
                  <Input
                    value={form.secondaryBtnText}
                    onChange={(e) => set('secondaryBtnText', e.target.value)}
                    placeholder="View Details"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Secondary Button URL
                  </label>
                  <Input
                    value={form.secondaryBtnUrl}
                    onChange={(e) => set('secondaryBtnUrl', e.target.value)}
                    placeholder="#services"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Images</h2>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Hero Image URL
                </label>
                <Input
                  value={form.heroImageUrl}
                  onChange={(e) => set('heroImageUrl', e.target.value)}
                  placeholder="https://..."
                />
                {form.heroImageUrl && (
                  <div className="mt-3 rounded-xl border overflow-hidden bg-muted/20 p-2">
                    <img
                      src={form.heroImageUrl}
                      alt="Hero preview"
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
                  Background Image URL{' '}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <Input
                  value={form.backgroundImageUrl}
                  onChange={(e) => set('backgroundImageUrl', e.target.value)}
                  placeholder="https://..."
                />
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
