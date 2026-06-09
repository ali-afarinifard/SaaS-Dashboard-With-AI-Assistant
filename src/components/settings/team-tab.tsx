"use client";
import { useState, useCallback, memo } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { mockApi } from "@/lib/mock-api";

const OWNER_ROLE_KEY = "owner" as const;

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

// MemberRow
const MemberRow = memo(function MemberRow({
  member,
  isRemoving,
  ownerLabel,
  removeLabel,
  onRemove,
}: {
  member: TeamMember;
  isRemoving: boolean;
  ownerLabel: string;
  removeLabel: string;
  onRemove: (id: string, name: string) => void;
}) {
  const handleRemove = useCallback(
    () => onRemove(member.id, member.name),
    [onRemove, member.id, member.name],
  );

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50 hover:bg-secondary/30 transition-colors">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold shrink-0">
        {member.name[0]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{member.name}</p>
        <p className="text-xs text-muted-foreground">{member.email}</p>
      </div>
      <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md">
        {member.role}
      </span>
      {member.role !== ownerLabel && (
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className="flex items-center gap-1 text-xs text-destructive hover:underline disabled:opacity-50"
        >
          {isRemoving && <Loader2 className="w-3 h-3 animate-spin" />}
          {removeLabel}
        </button>
      )}
    </div>
  );
});

export function TeamTab() {
  const t = useTranslations("settings");

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "m1", name: "Admin User", email: "admin@nexus.io", role: t("owner") },
    {
      id: "m2",
      name: "Sarah Mohammad",
      email: "sarah.mohammadi@techcorp.io",
      role: t("admin"),
    },
    {
      id: "m3",
      name: "Ali Farmani",
      email: "a.farmani@me.io",
      role: t("member"),
    },
  ]);
  const [removingMember, setRemovingMember] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  const handleInviteMember = useCallback(async () => {
    setInviting(true);
    try {
      await mockApi.team.invite("new@nexus.io");
      toast.success("Invitation sent", "Invite link copied to clipboard");
    } finally {
      setInviting(false);
    }
  }, []);

  const handleRemoveMember = useCallback(async (id: string, name: string) => {
    setRemovingMember(id);
    try {
      await mockApi.team.remove(name);
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
      toast.warning("Member removed", `${name} has been removed from the team`);
    } catch {
      toast.error("Failed", "Could not remove member. Try again.");
    } finally {
      setRemovingMember(null);
    }
  }, []);

  const ownerLabel = t(OWNER_ROLE_KEY);
  const removeLabel = t("remove");

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold">{t("teamMembers")}</h3>
        <button
          onClick={handleInviteMember}
          disabled={inviting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-70"
        >
          {inviting && <Loader2 className="w-3 h-3 animate-spin" />}
          {t("inviteMember")}
        </button>
      </div>
      <div className="space-y-3">
        {teamMembers.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            isRemoving={removingMember === member.id}
            ownerLabel={ownerLabel}
            removeLabel={removeLabel}
            onRemove={handleRemoveMember}
          />
        ))}
      </div>
    </div>
  );
}
