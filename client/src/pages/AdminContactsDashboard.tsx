import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Phone, Calendar } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function AdminContactsDashboard() {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const { data: submissions = [], refetch } = trpc.admin.contacts.list.useQuery();
  const markAsReadMutation = trpc.admin.contacts.markAsRead.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate({ id });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Contact Submissions</h1>
          <p className="text-muted-foreground">
            Total: {submissions.length} | Unread: {submissions.filter((s: any) => !s.read).length}
          </p>
        </div>

        <Card className="bg-card border border-border rounded-sm shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission: any) => (
                <TableRow key={submission.id} className={submission.read ? '' : 'bg-accent/5'}>
                  <TableCell className="font-medium">{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell className="max-w-xs truncate">{submission.subject}</TableCell>
                  <TableCell>{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      submission.read
                        ? 'bg-gray-500/20 text-gray-600'
                        : 'bg-blue-500/20 text-blue-600'
                    }`}>
                      {submission.read ? 'Read' : 'Unread'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Submission Detail Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl bg-card border border-border rounded-sm shadow-sm">
          <DialogHeader>
            <DialogTitle>{selectedSubmission?.subject}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-semibold">{selectedSubmission?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${selectedSubmission?.email}`} className="text-accent hover:underline">
                    {selectedSubmission?.email}
                  </a>
                </p>
              </div>
            </div>

            {selectedSubmission?.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-lg font-semibold flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${selectedSubmission?.phone}`} className="text-accent hover:underline">
                    {selectedSubmission?.phone}
                  </a>
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground">Date</label>
              <p className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(selectedSubmission?.createdAt).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Message</label>
              <div className="mt-2 p-4 bg-background rounded-lg border border-border">
                <p className="text-foreground whitespace-pre-wrap">{selectedSubmission?.message}</p>
              </div>
            </div>

            <div className="flex gap-3">
              {!selectedSubmission?.read && (
                <Button
                  className="bg-primary text-primary-foreground uppercase tracking-wider"
                  onClick={() => {
                    handleMarkAsRead(selectedSubmission.id);
                    setSelectedSubmission(null);
                  }}
                >
                  Mark as Read
                </Button>
              )}
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
