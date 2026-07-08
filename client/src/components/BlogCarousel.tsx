import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%238b5cf6;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%2306b6d4;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="400" height="300" fill="url(%23grad)" opacity="0.3"/%3E%3Crect x="50" y="50" width="300" height="200" fill="none" stroke="url(%23grad)" stroke-width="2" rx="8"/%3E%3Ccircle cx="200" cy="150" r="60" fill="none" stroke="url(%23grad)" stroke-width="2" opacity="0.6"/%3E%3C/svg%3E';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  coverImage?: string | null;
  author?: string | null;
}

interface BlogCarouselProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export function BlogCarousel({ posts, onSelectPost }: BlogCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, posts.length - itemsPerView);

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const truncateText = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + '...';
  };

  const visiblePosts = posts.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePosts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1, ease: [0.25, 0.46, 0.45, 0.94] as const }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
          >
          <Card
            className="bg-card border-border rounded-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full border"
          >
            {/* Blog Image */}
            <div className="w-full h-48 bg-muted border-b border-border overflow-hidden relative">
              <img
                src={post.coverImage || PLACEHOLDER_IMAGE}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Blog Content */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Title */}
              <h3 className="text-lg font-bold mb-3 line-clamp-2 text-foreground">
                {post.title}
              </h3>

              {/* Preview Text */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-grow">
                {truncateText(post.content, 100)}
              </p>

              {/* Author */}
              <p className="text-xs text-muted-foreground/70 mb-4">
                By {post.author || 'OMTT'}
              </p>

              {/* Read More Button */}
              <Button
                onClick={() => onSelectPost(post)}
                className="w-full bg-primary text-primary-foreground font-bold tracking-widest uppercase text-xs rounded-sm"
              >
                Read More
              </Button>
            </div>
          </Card>
          </motion.div>
        ))}
      </div>

      {/* Carousel Controls */}
      {posts.length > itemsPerView && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: Math.ceil(posts.length / itemsPerView) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(Math.min(idx * itemsPerView, maxIndex))}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === Math.floor(currentIndex / itemsPerView)
                    ? 'bg-primary w-6'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={currentIndex >= maxIndex}
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
