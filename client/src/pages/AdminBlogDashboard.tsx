import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Edit2, Trash2, Plus, X } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238b5cf6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2306b6d4;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23grad)" opacity="0.3"/%3E%3Crect x="50" y="50" width="300" height="200" fill="none" stroke="url(%23grad)" stroke-width="2" rx="8"/%3E%3Ccircle cx="200" cy="150" r="60" fill="none" stroke="url(%23grad)" stroke-width="2" opacity="0.6"/%3E%3C/svg%3E';

export default function AdminBlogDashboard() {
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: user?.name || '',
    coverImage: '',
    published: 0,
  });

  const { data: posts = [], refetch } = trpc.admin.blog.list.useQuery();
  const createMutation = trpc.admin.blog.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreateOpen(false);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: user?.name || '',
        coverImage: '',
        published: 0,
      });
    },
  });

  const updateMutation = trpc.admin.blog.update.useMutation({
    onSuccess: () => {
      refetch();
      setIsEditOpen(false);
      setEditingId(null);
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: user?.name || '',
        coverImage: '',
        published: 0,
      });
    },
  });

  const deleteMutation = trpc.admin.blog.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({
        id: editingId,
        ...formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || '',
      content: post.content,
      author: post.author || user?.name || '',
      coverImage: post.coverImage || '',
      published: post.published,
    });
    setIsEditOpen(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: user?.name || '',
      coverImage: '',
      published: 0,
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Blog Management</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground uppercase tracking-wider">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border border-border rounded-sm shadow-sm">
              <DialogHeader>
                <DialogTitle>Create New Blog Post</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    placeholder="Post title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-muted border border-border rounded-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Slug</label>
                  <Input
                    placeholder="post-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="bg-muted border border-border rounded-sm"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Excerpt</label>
                  <Input
                    placeholder="Brief summary"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="bg-muted border border-border rounded-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    placeholder="Full post content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-muted border border-border rounded-sm min-h-48"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Author</label>
                  <Input
                    placeholder="Author name"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="bg-muted border border-border rounded-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Cover Image URL</label>
                  <Input
                    placeholder="https://..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="bg-muted border border-border rounded-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published === 1}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                    className="rounded"
                  />
                  <label htmlFor="published" className="text-sm font-medium">Publish immediately</label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-primary text-primary-foreground uppercase tracking-wider flex-1" disabled={createMutation.isPending}>
                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Post
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border border-border rounded-sm shadow-sm">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle>Edit Blog Post</DialogTitle>
              <button onClick={handleCancel} className="p-1 hover:bg-accent/20 rounded">
                <X className="h-4 w-4" />
              </button>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  placeholder="Post title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-muted border border-border rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Slug</label>
                <Input
                  placeholder="post-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-muted border border-border rounded-sm"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Excerpt</label>
                <Input
                  placeholder="Brief summary"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="bg-muted border border-border rounded-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  placeholder="Full post content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="bg-muted border border-border rounded-sm min-h-48"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Author</label>
                <Input
                  placeholder="Author name"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="bg-muted border border-border rounded-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Cover Image URL</label>
                <Input
                  placeholder="https://..."
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  className="bg-muted border border-border rounded-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published-edit"
                  checked={formData.published === 1}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked ? 1 : 0 })}
                  className="rounded"
                />
                <label htmlFor="published-edit" className="text-sm font-medium">Published</label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-primary text-primary-foreground uppercase tracking-wider flex-1" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Update Post
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Card className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post: any) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author || 'OMTT'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      post.published ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMutation.mutate({ id: post.id })}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
