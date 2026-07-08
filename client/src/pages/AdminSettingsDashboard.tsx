import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Check, Building, Phone, Globe, Link2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function AdminSettingsDashboard() {
  const { data, isLoading } = trpc.admin.cms.getContent.useQuery();
  const utils = trpc.useUtils();

  const [form, setForm] = useState({
    companyName: '',
    tagline: '',
    description: '',
    address: '',
    phone1: '',
    phone2: '',
    email1: '',
    email2: '',
    logoUrl: '',
    faviconUrl: '',
    googleMapsEmbed: '',
    socialLinkedin: '',
    socialTwitter: '',
    socialGithub: '',
    footerText: '',
    copyrightText: '',
  });

  useEffect(() => {
    if (data?.settings) {
      setForm({
        companyName: data.settings.companyName || '',
        tagline: data.settings.tagline || '',
        description: data.settings.description || '',
        address: data.settings.address || '',
        phone1: data.settings.phone1 || '',
        phone2: data.settings.phone2 || '',
        email1: data.settings.email1 || '',
        email2: data.settings.email2 || '',
        logoUrl: data.settings.logoUrl || '',
        faviconUrl: data.settings.faviconUrl || '',
        googleMapsEmbed: data.settings.googleMapsEmbed || '',
        socialLinkedin: data.settings.socialLinkedin || '',
        socialTwitter: data.settings.socialTwitter || '',
        socialGithub: data.settings.socialGithub || '',
        footerText: data.settings.footerText || '',
        copyrightText: data.settings.copyrightText || '',
      });
    }
  }, [data]);

  const updateMutation = trpc.admin.cms.updateSettings.useMutation({
    onSuccess: () => {
      toast.success('Settings saved');
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
          <Skeleton className="h-[600px] rounded-sm" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your company information, branding, and contact details
          </p>
        </div>

        <Card className="rounded-sm border p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Info */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Building className="h-4 w-4" />
                Company Information
              </h2>
              <div>
                <label className="text-sm font-medium mb-2 block">Company Name</label>
                <Input
                  value={form.companyName}
                  onChange={(e) => set('companyName', e.target.value)}
                  placeholder="OM TECHNO TOOLS"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Tagline</label>
                <Input
                  value={form.tagline}
                  onChange={(e) => set('tagline', e.target.value)}
                  placeholder="Engineered for Precision..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Company description..."
                  className="min-h-24"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contact Details
              </h2>
              <div>
                <label className="text-sm font-medium mb-2 block">Address</label>
                <Textarea
                  value={form.address}
                  onChange={(e) => set('address', e.target.value)}
                  placeholder="Full address..."
                  className="min-h-20"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone 1</label>
                  <Input
                    value={form.phone1}
                    onChange={(e) => set('phone1', e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone 2</label>
                  <Input
                    value={form.phone2}
                    onChange={(e) => set('phone2', e.target.value)}
                    placeholder="+91 XXXXXXXXXX"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email 1</label>
                  <Input
                    type="email"
                    value={form.email1}
                    onChange={(e) => set('email1', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email 2</label>
                  <Input
                    type="email"
                    value={form.email2}
                    onChange={(e) => set('email2', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Branding & Assets
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Logo URL</label>
                  <Input
                    value={form.logoUrl}
                    onChange={(e) => set('logoUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Favicon URL</label>
                  <Input
                    value={form.faviconUrl}
                    onChange={(e) => set('faviconUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Google Maps Embed URL
                </label>
                <Input
                  value={form.googleMapsEmbed}
                  onChange={(e) => set('googleMapsEmbed', e.target.value)}
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Social Media
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">LinkedIn</label>
                  <Input
                    value={form.socialLinkedin}
                    onChange={(e) => set('socialLinkedin', e.target.value)}
                    placeholder="https://linkedin.com/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Twitter</label>
                  <Input
                    value={form.socialTwitter}
                    onChange={(e) => set('socialTwitter', e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">GitHub</label>
                  <Input
                    value={form.socialGithub}
                    onChange={(e) => set('socialGithub', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Footer</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Footer Text</label>
                  <Input
                    value={form.footerText}
                    onChange={(e) => set('footerText', e.target.value)}
                    placeholder="Precision engineering partner..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Copyright Text</label>
                  <Input
                    value={form.copyrightText}
                    onChange={(e) => set('copyrightText', e.target.value)}
                    placeholder="Â© 2026 Company. All rights reserved."
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
                  'Save Settings'
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
