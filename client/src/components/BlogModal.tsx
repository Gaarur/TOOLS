import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import type { BlogPost } from '../../../drizzle/schema';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238b5cf6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2306b6d4;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23grad)" opacity="0.3"/%3E%3Crect x="50" y="50" width="300" height="200" fill="none" stroke="url(%23grad)" stroke-width="2" rx="8"/%3E%3Ccircle cx="200" cy="150" r="60" fill="none" stroke="url(%23grad)" stroke-width="2" opacity="0.6"/%3E%3C/svg%3E';

interface BlogModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlogModal({ post, isOpen, onClose }: BlogModalProps) {
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border border-border rounded-sm shadow-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl">{post.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="w-full h-64 rounded-lg overflow-hidden bg-primary text-primary-foreground">
            <img
              src={post.coverImage || PLACEHOLDER_IMAGE}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{post.author || 'OMTT'}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {post.excerpt && (
            <p className="text-lg text-foreground/80 font-semibold italic">{post.excerpt}</p>
          )}

          <div className="prose prose-invert max-w-none">
            <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
