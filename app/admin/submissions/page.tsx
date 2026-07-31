"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { TableRow } from "@/components/TableRow";

const rowLayout = "grid grid-cols-6 items-center justify-items-center gap-x-6 px-6 py-3";

export type TSubmission = {
    id: number;
    created_at: string;
    updated_at: string;
    netid: string;
    name: string;
    title: string;
    category: string;
    description: string;
    equipment_images: string[];
    equipment_labels: string[];
    checkout_responses: boolean[];
    due_date: string;
    due_time: string;
    checkout_staff: string;
    checkin_responses: boolean[];
    checkin_staff: string;
    parts_working: boolean;
    checkin_description: string;
    status: string;
};

/** Formats due_date as "MM/DD/YYYY". Built from the "YYYY-MM-DD" string
 *  directly — new Date() would parse it as UTC midnight and show the previous
 *  day in US timezones. */
function formatDueDate(s: TSubmission): string {
    if (!s.due_date) return "";
    const [year, month, day] = s.due_date.split("-");
    return `${month}/${day}/${year}`;
}

/** Formats due_time as "HH:MM AM/PM" in the viewer's timezone. */
function formatDueTime(s: TSubmission): string {
    if (!s.due_time) return "";
    return new Date(s.due_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/** Row order within a NetID group: checked-out submissions before checked-in,
 *  then newest checkout date first, then soonest due date, then soonest due
 *  time. due_date ("YYYY-MM-DD") and due_time (ISO, same 1970 anchor) both
 *  sort correctly as strings. */
function compareSubmissions(a: TSubmission, b: TSubmission): number {
    return (
        Number(a.status === "Checked In") - Number(b.status === "Checked In") ||
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime() ||
        String(a.due_date ?? "").localeCompare(String(b.due_date ?? "")) ||
        String(a.due_time ?? "").localeCompare(String(b.due_time ?? ""))
    );
}


export default function Page() {
    const [submissions, setSubmissions] = useState<TSubmission[]>([]);
    const [groupedByNetID, setGroupedByNetID] = useState<[string, TSubmission[]][]>([]);
    const [filteredGroupedByNetID, setFilteredGroupByNetID] = useState<[string, TSubmission[]][]>([]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            const res = await fetch('/api/submissions');
            if (!res.ok) {
                console.error("Error fetching submissions");
                return;
            }
            const data = await res.json();
            setSubmissions(data);
        };
        fetchSubmissions();
    }, []);

    useEffect(() => {
        const unsortedGroupBy = submissions.reduce((acc: Record<string, TSubmission[]>, submission: TSubmission) => {
            const netid = submission.netid;
            const name = submission.name;
            const key = netid + " - " + name;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(submission);
            return acc;
        }, {});

        const sortedGroupBy = Object.entries(unsortedGroupBy)
            .map(([key, group]): [string, TSubmission[]] => [key, group.toSorted(compareSubmissions)])
            .toSorted((a, b) => a[0].localeCompare(b[0]));

        setGroupedByNetID(sortedGroupBy);
        setFilteredGroupByNetID(sortedGroupBy);
    }, [submissions])

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setFilteredGroupByNetID(groupedByNetID.filter(entry => entry[0].toLowerCase().includes(e.target.value.toLowerCase())));
    }

    const router = useRouter();

    return (
        <div className='mt-[40px]'>
            <SearchBar title='Submissions' buttonText={<>Group by: <strong><u>NetID</u></strong></>} link='' placeholder="Search by NetID or Name." searchHandler={handleSearch} />
            <div className="pl-[47px] pr-[47px] mt-[24px]">
                <div className="space-y-4">
                    <div className={`${rowLayout} rounded-xl bg-[#222d65] text-white h-[60px] mb-4 text-sm font-medium`}>
                        <span className="justify-self-start px-10"><strong>NetID/Form Title</strong></span>
                        <span><strong>Checkout Date</strong></span>
                        <span><strong>Due Date</strong></span>
                        <span><strong>Due Time</strong></span>
                        <span><strong>Status</strong></span>
                        <span></span>
                    </div>

                    {filteredGroupedByNetID.map(([key, submissions]) => (
                        <Collapsible key={key}>
                            <CollapsibleTrigger className={`${rowLayout} w-full group bg-[#e7f0ff] rounded-xl hover:bg-blue-100`}>
                                <div className="flex items-center justify-self-start px-5 gap-2 font-semibold text-[#222d65]">
                                    <Play className="h-3 w-3 fill-[#222d65] rotate-90 group-data-[state=open]:-rotate-90 transition-none"/>
                                    {key}
                                </div>
                            </CollapsibleTrigger>

                            <CollapsibleContent className="pt-2 space-y-2">
                                {(submissions as TSubmission[]).map((s, i) => (
                                <TableRow key={i}>
                                    {/* content-center keeps the row track centered when the
                                        buttons make it taller than TableRow's fixed height */}
                                    <div className={`grid grid-cols-6 items-center content-center justify-items-center gap-x-6 h-full`}>
                                        <span className="justify-self-start px-10 whitespace-nowrap">{s.title}</span>
                                        <span>{new Date(s.created_at).toLocaleDateString()}</span>
                                        <span>{formatDueDate(s)}</span>
                                        <span className="whitespace-nowrap">{formatDueTime(s)}</span>
                                        <span
                                            className={
                                                (s.status === "Checked In"
                                                ? " text-green-600 font-semibold"
                                                : " text-purple-600 whitespace-nowrap font-semibold")
                                            }
                                        >
                                            {s.status}
                                        </span>
                                        <div className='flex flex-row gap-[15px]'>
                                            <Button variant='outline' className='!bg-[#E7F0FF] !border-[#222D65] !font-inter !font-[400] !text-[#222D65] !rounded-xl !px-[18px] !py-[5px]' onClick={() => router.push(`/admin/submissions/${s.id}/check-in${s.status === "Checked In" ? "" : "/edit"}`)}>Check In</Button>
                                            <Button variant='outline' className='!bg-[#E7F0FF] !border-[#222D65] !font-inter !font-[400] !text-[#222D65] !rounded-xl !px-[18px] !py-[5px]' asChild>
                                                <Link href={`/admin/submissions/${s.id}`}>View</Link>
                                            </Button>
                                        </div>
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
