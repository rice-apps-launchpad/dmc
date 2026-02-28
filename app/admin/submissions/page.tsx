"use client"

import mockSubmissions from "@/lib/mock_submissions.json";
// collapsible component
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger, 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Play, FileCheckIcon } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { TableRow } from "@/components/TableRow";

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

    const checkedOut: React.ReactNode = (
        <span className="flex items-center gap-2 text-purple-600 font-semibold">
            Checked Out
          <Button
                variant="ghost"
                size="icon"
                title="Check In"
                className="h-6 w-6 text-purple-600 hover:!text-purple-600"
            >
                <FileCheckIcon className="h-4 w-4" />
            </Button>
        </span>
    );


    return (
        <div className='mt-[40px]'>
            <SearchBar title='Submissions' buttonText={<>Group by: <strong><u>NetID</u></strong></>} link='' />
            <div className="pl-[47px] pr-[47px] mt-[24px]">
                <div className="space-y-4">
                    { /* submissions header table */ }
                    <div className={`${rowLayout} rounded-xl bg-[#222d65] text-white h-[60px] mb-4 text-sm font-medium`}>
                        <span className="justify-self-start px-10"><strong>NetID/Form Title</strong></span>
                        <span><strong>Form ID</strong></span>
                        <span><strong>Created At</strong></span>
                        <span><strong>Updated At</strong></span>
                        <span className="justify-self-start px-12"><strong>Status</strong></span>
                    </div>

                    { /* actual submissions */ }
                    {Object.entries(groupedByNetID).map(([netid, submissions]) => (
                        <Collapsible key={netid}>
                            <CollapsibleTrigger className={`${rowLayout} w-full group bg-[#e7f0ff] rounded-xl hover:bg-blue-100`}>
                                <div className="flex items-center justify-self-start px-5 gap-2 font-semibold text-[#222d65]">
                                    <Play className="h-3 w-3 fill-[#222d65] rotate-90 group-data-[state=open]:-rotate-90 transition-none"/>
                                    {netid}
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="pt-2 space-y-2">
                                {(submissions as any[]).map((s, i) => (
                                <TableRow key={i}>
                                    <div className={`grid grid-cols-5 items-center justify-items-center gap-x-6 h-full`}>
                                        <span className="justify-self-start px-10">Form 1 {/* use actual form number when available */}</span>
                                        <span>{s.id} {/*add zeros in front?*/}</span>
                                        <span>{s.created_at}</span>
                                        <span>{s.updated_at}</span>
                                        <span
                                            className={
                                                "justify-self-start px-12" +
                                                (s.status === "Checked In"
                                                ? " text-green-600 font-semibold"
                                                : " text-purple-600 font-semibold")
                                            }
                                        >
                                            {s.status === "Checked In"
                                            ? s.status
                                            : checkedOut
                                            }
                                        </span>
                                    </div>
                                </TableRow>
                                ))}
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            </div>
        </div>
    )
}
