import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export default function AdminPortal() {
  const { user, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const adminLoginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      // Redirect to admin dashboard after successful login
      window.location.href = '/admin/dashboard';
    },
    onError: (err: any) => {
      setError(err.message || 'Invalid credentials');
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await adminLoginMutation.mutateAsync({
        username,
        password,
      });
    } catch (err) {
      // Error is handled by mutation onError
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already authenticated and is admin, show dashboard
  if (isAuthenticated && user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="bg-card border-border rounded-sm shadow-md w-full max-w-md p-8">
          <h1 className="text-2xl font-bold uppercase tracking-tight text-center mb-4">Admin Dashboard</h1>
          <p className="text-center text-muted-foreground mb-8">
            Welcome back, {user.name || 'Admin'}
          </p>
          <div className="space-y-4">
            <Button className="w-full bg-primary text-primary-foreground font-bold tracking-widest uppercase rounded-sm" onClick={() => window.location.href = '/admin/dashboard'}>
              Go to CMS Dashboard
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/admin/blog'}>
              Manage Blog Posts
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/admin/contacts'}>
              View Contact Submissions
            </Button>
            <Button className="w-full" variant="outline" onClick={() => window.location.href = '/admin/settings'}>
              Site Settings
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show login form
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="bg-card border-border rounded-sm shadow-md w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-center text-foreground uppercase tracking-tight mb-2">OMTT</h1>
          <p className="text-center text-sm text-muted-foreground">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username
            </label>
            <Input
              id="username"
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="bg-muted border-border rounded-sm focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="bg-muted border-border rounded-sm focus-visible:ring-primary"
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-bold tracking-widest uppercase rounded-sm"
            disabled={isLoading || !username || !password}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground mt-6">
          This portal is for authorized administrators only.
        </p>
      </Card>
    </div>
  );
}
