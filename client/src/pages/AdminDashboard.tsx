import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Settings,
  Mail,
  MailOpen,
  Globe,
  ArrowRight,
  Activity,
  Clock,
} from 'lucide-react';
import { useLocation } from 'wouter';

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-border bg-card p-6 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: accent + '14' }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { data: stats, isLoading } = trpc.admin.getStats.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <Skeleton className="h-9 w-48 mb-2" />
            <Skeleton className="h-5 w-72" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-sm" />
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-sm" />
            <Skeleton className="h-80 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Blog Posts',
      value: stats?.blogCount ?? 0,
      icon: FileText,
      accent: '#3b82f6',
    },
    {
      label: 'Services',
      value: stats?.serviceCount ?? 0,
      icon: Settings,
      accent: '#8b5cf6',
    },
    {
      label: 'Contact Messages',
      value: stats?.contactCount ?? 0,
      icon: Mail,
      accent: '#10b981',
    },
    {
      label: 'Unread Messages',
      value: stats?.unreadContactCount ?? 0,
      icon: MailOpen,
      accent: '#f59e0b',
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of your website content and activity
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-sm px-3 py-1 text-xs font-medium ${
                stats?.websiteStatus === 'Live'
                  ? 'bg-emerald-500/10 text-emerald-600'
                  : 'bg-amber-500/10 text-amber-600'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-sm ${
                  stats?.websiteStatus === 'Live'
                    ? 'bg-emerald-500'
                    : 'bg-amber-500'
                }`}
              />
              {stats?.websiteStatus ?? 'Checking...'}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Edit Hero', path: '/admin/content/hero', icon: Globe },
            { label: 'Manage Services', path: '/admin/content/services', icon: Settings },
            { label: 'View Messages', path: '/admin/contacts', icon: Mail },
            { label: 'SEO Settings', path: '/admin/seo', icon: Activity },
          ].map((action) => (
            <button
              key={action.path}
              onClick={() => setLocation(action.path)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <action.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Contact Submissions */}
          <Card className="overflow-hidden rounded-sm border">
            <div className="flex items-center justify-between border-b p-5">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">Recent Messages</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/admin/contacts')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View all
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="divide-y">
              {stats?.recentSubmissions?.length ? (
                stats.recentSubmissions.map((sub: any) => (
                  <div
                    key={sub.id}
                    className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-sm font-semibold text-primary">
                      {sub.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium truncate">{sub.name}</p>
                        {!sub.read && (
                          <span className="shrink-0 h-2 w-2 rounded-sm bg-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {sub.subject}
                      </p>
                      <p className="text-xs text-muted-foreground/60 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No contact submissions yet
                </div>
              )}
            </div>
          </Card>

          {/* Recent Blog Posts */}
          <Card className="overflow-hidden rounded-sm border">
            <div className="flex items-center justify-between border-b p-5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h2 className="font-semibold">Recent Blog Posts</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/admin/blog')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View all
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="divide-y">
              {stats?.recentBlogs?.length ? (
                stats.recentBlogs.map((blog: any) => (
                  <div
                    key={blog.id}
                    className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
                      <FileText className="h-4 w-4 text-violet-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{blog.title}</p>
                      <p className="text-xs text-muted-foreground/60 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-medium ${
                        blog.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {blog.status || 'draft'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No blog posts yet
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
