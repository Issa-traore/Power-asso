"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setOrganizationStatus } from "@/lib/actions/platform-actions";
import type { OrgStatus } from "@prisma/client";

const OPTIONS: OrgStatus[] = ["TRIAL", "ACTIVE", "SUSPENDED", "CANCELED"];

export function OrgStatusSelect({ organizationId, status }: { organizationId: string; status: OrgStatus }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(async () => {
          await setOrganizationStatus(organizationId, e.target.value as OrgStatus);
          router.refresh();
        })
      }
      className="rounded border border-neutral-300 px-2 py-1 text-xs"
    >
      {OPTIONS.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
