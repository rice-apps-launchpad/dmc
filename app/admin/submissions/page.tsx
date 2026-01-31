"use client"

import mock_submissions from "@/lib/mock_submissions.json"
// collapsible component
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"

function TableRow({ children }: { children: React.ReactNode }) {
    return (
    <div className="rounded-xl border bg-white">
        {children}
    </div>)
}

export default function Page() {
    // group submissions by netid - CHANGE LATER FOR OTHER GROUPS
    const groupedByNetID = mock_submissions.reduce((acc: Record<string, any[]>, submission: any) => {
        const netid = submission.netid;
        if (!acc[netid]) {
            acc[netid] = [];
        }
        acc[netid].push(submission);
        return acc;
    }, {});
    return (
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <div>
                { /* submissions header table */ }
                <div className="grid grid-cols-5 gap-4 items-center text-center rounded-xl bg-[#222d65] text-white px-4 py-5 text-sm font-medium">
                    <span>NetID / Form Title</span>
                    <span>Form ID</span>
                    <span>Created At</span>
                    <span>Updated At</span>
                    <span>Status</span>
                </div>

                { /* actual submissions */ }
                {Object.entries(groupedByNetID).map(([netid, submissions]) => (
                    <Collapsible key={netid} className="rounded-xl border border-blue-100">
                        <CollapsibleTrigger className="group w-full px-6 py-3 bg-blue-50 rounded-xl hover:bg-blue-100">
                            <div className="flex items-center gap-2 font-semibold text-[#222d65]">
                                <ChevronDown className="h-4 w-4 group-data-[state=open]:rotate-180" />
                                {netid}
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="px-6 pb-4 space-y-2">
                            {(submissions as any[]).map((s, i) => (
                            <TableRow key={i}>
                                <div className="grid grid-cols-5 items-center px-6 py-3 text-sm text-[#222d65]">
                                    <span>Form 1 {/* use actual form number when available */}</span>
                                    <span>{s.id}</span>
                                    <span>{s.created_at}</span>
                                    <span>{s.updated_at}</span>
                                    <span
                                        className={
                                            s.status === "Checked In"
                                            ? "text-green-600 font-semibold"
                                            : "text-purple-600 font-semibold"
                                        }
                                    >
                                        {s.status}
                                    </span>
                                </div>
                            </TableRow>
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </div>
    )
}