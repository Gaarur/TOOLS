import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Users,
  Linkedin,
  Twitter,
  Github,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

type TeamForm = {
  id?: number;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  linkedin: string;
  twitter: string;
  github: string;
  displayOrder: number;
};

const emptyForm: TeamForm = {
  name: '',
  role: '',
  bio: '',
  photoUrl: '',
  linkedin: '',
  twitter: '',
  github: '',
  displayOrder: 0,
};

export default function AdminContentTeam() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<TeamForm>(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  const { data: teamList = [], isLoading } =
    trpc.admin.cms.listTeam.useQuery();
  const utils = trpc.useUtils();

  const createMutation = trpc.admin.cms.createTeamMember.useMutation({
    onSuccess: () => {
      toast.success('Team member added');
      utils.admin.cms.listTeam.invalidate();
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const updateMutation = trpc.admin.cms.updateTeamMember.useMutation({
    onSuccess: () => {
      toast.success('Team member updated');
      utils.admin.cms.listTeam.invalidate();
      closeDialog();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deleteMutation = trpc.admin.cms.deleteTeamMember.useMutation({
    onSuccess: () => {
      toast.success('Team member removed');
      utils.admin.cms.listTeam.invalidate();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const closeDialog = () => {
    setDialogOpen(false);
    setForm(emptyForm);
    setIsEditing(false);
  };

  const openCreate = () => {
    setForm({ ...emptyForm, displayOrder: teamList.length });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (member: any) => {
    setForm({
      id: member.id,
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      photoUrl: member.photoUrl || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      github: member.github || '',
      displayOrder: member.displayOrder ?? 0,
    });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && form.id) {
      updateMutation.mutate(form as TeamForm & { id: number });
    } else {
      const { id, ...rest } = form;
      createMutation.mutate(rest);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Remove this team member?')) {
      deleteMutation.mutate({ id });
    }
  };

  const set = (key: string, val: string | number) =>
    setForm((p) => ({ ...p, [key]: val }));

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Members</h1>
            <p className="text-muted-foreground mt-1">
              Manage team members shown on the landing page
            </p>
          </div>
          <Button onClick={openCreate} size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Team Grid */}
        {teamList.length === 0 ? (
          <Card className="rounded-sm border p-12 text-center">
            <Users className="h-10 w-10 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-lg font-medium mb-1">No team members yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add your team to personalize the landing page
            </p>
            <Button onClick={openCreate} variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Add Member
            </Button>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamList.map((member: any) => (
              <div
                key={member.id}
                className="group relative rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  {member.photoUrl ? (
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      className="h-14 w-14 rounded-sm object-cover border"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-sm bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                      {member.name?.charAt(0)?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{member.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="text-xs text-muted-foreground/70 mt-2 line-clamp-2">
                        {member.bio}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      {member.linkedin && (
                        <Linkedin className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {member.twitter && (
                        <Twitter className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      {member.github && (
                        <Github className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEdit(member)}
                    className="h-7 w-7 p-0"
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(member.id)}
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? 'Edit Team Member' : 'Add Team Member'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Full Name
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <Input
                    value={form.role}
                    onChange={(e) => set('role', e.target.value)}
                    placeholder="Lead Engineer"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Bio</label>
                <Textarea
                  value={form.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  placeholder="Short biography..."
                  className="min-h-24"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Photo URL
                  </label>
                  <Input
                    value={form.photoUrl}
                    onChange={(e) => set('photoUrl', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={form.displayOrder}
                    onChange={(e) =>
                      set('displayOrder', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  Social Links
                </h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block flex items-center gap-1.5">
                      <Linkedin className="h-3 w-3" /> LinkedIn
                    </label>
                    <Input
                      value={form.linkedin}
                      onChange={(e) => set('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block flex items-center gap-1.5">
                      <Twitter className="h-3 w-3" /> Twitter
                    </label>
                    <Input
                      value={form.twitter}
                      onChange={(e) => set('twitter', e.target.value)}
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1.5 block flex items-center gap-1.5">
                      <Github className="h-3 w-3" /> GitHub
                    </label>
                    <Input
                      value={form.github}
                      onChange={(e) => set('github', e.target.value)}
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="min-w-28">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : isEditing ? (
                    'Update Member'
                  ) : (
                    'Add Member'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
