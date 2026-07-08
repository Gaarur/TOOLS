import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Check, Globe, Search } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AdminSeoSettings() {
  const { data, isLoading } = trpc.admin.cms.getContent.useQuery();
  const utils = trpc.useUtils();

  const [form, setForm] = useState({
    title: '',
    metaDescription: '',
    keywords: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    robots: 'index, follow',
    canonicalUrl: '',
  });

  useEffect(() => {
    if (data?.seo) {
      setForm({
        title: data.seo.title || '',
        metaDescription: data.seo.metaDescription || '',
        keywords: data.seo.keywords || '',
        ogImage: data.seo.ogImage || '',
        twitterCard: data.seo.twitterCard || 'summary_large_image',
        robots: data.seo.robots || 'index, follow',
        canonicalUrl: data.seo.canonicalUrl || '',
      });
    }
  }, [data]);

  const updateMutation = trpc.admin.cms.updateSeo.useMutation({
    onSuccess: () => {
      toast.success('SEO settings saved');
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure search engine optimization for your website
          </p>
        </div>

        {/* Search Preview */}
        <div className="rounded-sm border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Google Search Preview
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-lg text-blue-600 hover:underline cursor-pointer truncate">
              {form.title || 'Page Title'}
            </p>
            <p className="text-sm text-emerald-700 truncate">
              {form.canonicalUrl || 'https://yourdomain.com'}
            </p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {form.metaDescription || 'Add a meta description to preview how your page appears in search results.'}
            </p>
          </div>
        </div>

        <Card className="rounded-sm border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic SEO */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Basic SEO
              </h2>
              <div>
                <label className="text-sm font-medium mb-2 block">Page Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  placeholder="OM TECHNO TOOLS - Precision Engineering"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {form.title.length}/60 characters recommended
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Meta Description
                </label>
                <Textarea
                  value={form.metaDescription}
                  onChange={(e) => set('metaDescription', e.target.value)}
                  placeholder="Concise description of your website..."
                  className="min-h-24"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {form.metaDescription.length}/160 characters recommended
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Keywords
                </label>
                <Input
                  value={form.keywords}
                  onChange={(e) => set('keywords', e.target.value)}
                  placeholder="moulds, plastic injection, precision engineering"
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Comma-separated list of target keywords
                </p>
              </div>
            </div>

            {/* Advanced */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Advanced Settings</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Canonical URL
                  </label>
                  <Input
                    value={form.canonicalUrl}
                    onChange={(e) => set('canonicalUrl', e.target.value)}
                    placeholder="https://yourdomain.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Robots Directive
                  </label>
                  <Input
                    value={form.robots}
                    onChange={(e) => set('robots', e.target.value)}
                    placeholder="index, follow"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Twitter Card Type
                  </label>
                  <Input
                    value={form.twitterCard}
                    onChange={(e) => set('twitterCard', e.target.value)}
                    placeholder="summary_large_image"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    OG Image URL
                  </label>
                  <Input
                    value={form.ogImage}
                    onChange={(e) => set('ogImage', e.target.value)}
                    placeholder="https://..."
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
                  'Save SEO Settings'
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
