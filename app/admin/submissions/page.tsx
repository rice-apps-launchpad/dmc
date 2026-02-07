"use client"

import mockSubmissions from "@/lib/mock_submissions.json"
// collapsible component
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown, Play } from "lucide-react"
import { SearchBar } from "@/components/ui/HeaderSearch";


function TableRow({ children }: { children: React.ReactNode }) {
    return (
    <div className="border border-slate-400 hover:border-slate-900 transition rounded-xl">
        {children}
    </div>)
}

const rowLayout = "grid grid-cols-5 items-center justify-items-center gap-x-6 px-6 py-3";


export default function Page() {
    // group submissions by netid - CHANGE LATER FOR OTHER GROUPS
    const groupedByNetID = mockSubmissions.reduce((acc: Record<string, any[]>, submission: any) => {
        const netid = submission.netid;
        if (!acc[netid]) {
            acc[netid] = [];
        }
        acc[netid].push(submission);
        return acc;
    }, {});
    return (
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
            <SearchBar title='Submissions' buttonText={<>Group by: <strong><u>NetID</u></strong></>}></SearchBar>
            <div className="space-y-4">
                { /* submissions header table */ }
                <div className={`${rowLayout} rounded-xl bg-[#222d65] text-[#e7f0ff] px-4 py-5 mb-4 text-sm font-medium`}>
                    <span className="justify-self-start px-10">NetID / Form Title</span>
                    <span>Form ID</span>
                    <span>Created At</span>
                    <span>Updated At</span>
                    <span className="justify-self-start px-12">Status</span>
                </div>

                { /* actual submissions */ }
                {Object.entries(groupedByNetID).map(([netid, submissions]) => (
                    <Collapsible key={netid}>
                        <CollapsibleTrigger className={`${rowLayout} w-full group bg-[#e7f0ff] rounded-xl hover:bg-blue-100`}>
                            <div className="flex items-center justify-self-start px-5 gap-2 font-semibold text-[#222d65]">
                                <Play className="h-3 w-3 fill-[#222d65] -rotate-90 group-data-[state=open]:rotate-90 transition-none"/>
                                {netid}
                            </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="pt-2 space-y-2">
                            {(submissions as any[]).map((s, i) => (
                            <TableRow key={i}>
                                <div className={`${rowLayout} text-sm text-[#222d65]`}>
                                    <span className="justify-self-start px-10">Form 1 {/* use actual form number when available */}</span>
                                    <span>{s.id} {/*add zeros in front?*/}</span>
                                    <span>{s.created_at}</span>
                                    <span>{s.updated_at}</span>
                                    <span
                                        className={
                                            "justify-self-start px-10" +
                                            (s.status === "Checked In"
                                            ? " text-green-600 font-semibold"
                                            : " text-purple-600 font-semibold")
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
