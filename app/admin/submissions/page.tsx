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
import { Checkbox } from "@/components/ui/checkbox";
import { Play } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { TableRow } from "@/components/TableRow";

const rowLayout = "grid items-center justify-items-center gap-x-6 px-6 py-3";
const templateColumnsStyle = { gridTemplateColumns: "repeat(5, minmax(0, 1fr)) 2fr"}

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

    // Bulk delete modal state.
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [bulkDeleteDate, setBulkDeleteDate] = useState("");
    const [includeCheckedOut, setIncludeCheckedOut] = useState(false);
    const [bulkDeleting, setBulkDeleting] = useState(false);
    const [bulkDeleteError, setBulkDeleteError] = useState(false);

    // Matches the server's predicate: created on/before the cutoff date, and
    // (unless opted in) only checked-in submissions.
    function matchesBulkDelete(s: TSubmission): boolean {
        if (!bulkDeleteDate) return false;
        const endOfDay = new Date(`${bulkDeleteDate}T23:59:59.999`);
        return new Date(s.created_at) <= endOfDay && (includeCheckedOut || s.status === "Checked In");
    }
    const bulkDeleteCount = submissions.filter(matchesBulkDelete).length;

    function closeBulkDelete() {
        setBulkDeleteOpen(false);
        setBulkDeleteDate("");
        setIncludeCheckedOut(false);
        setBulkDeleteError(false);
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this submission?")) return;
        const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            console.error("Delete failed:", await res.text());
            return;
        }
        setSubmissions(prev => prev.filter(s => s.id !== id));
    }

    async function handleBulkDelete() {
        setBulkDeleting(true);
        setBulkDeleteError(false);
        const res = await fetch('/api/submissions', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ before: bulkDeleteDate, includeCheckedOut }),
        });
        setBulkDeleting(false);
        if (!res.ok) {
            console.error("Bulk delete failed:", await res.text());
            setBulkDeleteError(true);
            return;
        }
        setSubmissions(prev => prev.filter(s => !matchesBulkDelete(s)));
        closeBulkDelete();
    }

    return (
        <div className='mt-[40px]'>
            <SearchBar title='Submissions' buttonText={<>Group by: <strong><u>NetID</u></strong></>} link='' placeholder="Search by NetID or Name." searchHandler={handleSearch}>
                <Button className='w-[196px] !bg-[#B20000] h-[100%] text-white !rounded-full !font-inter' onClick={() => setBulkDeleteOpen(true)}>Bulk Delete</Button>
            </SearchBar>

            {bulkDeleteOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeBulkDelete}>
                    <div className="flex flex-col gap-[20px] bg-white border-2 border-[#222D65] rounded-[20px] p-[40px] w-[480px]" onClick={(e) => e.stopPropagation()}>
                        <h1 className="font-bold text-[24px] text-[#222D65]">Bulk Delete Submissions</h1>
                        <p className="text-[16px] text-[#474747] !font-inter">Deletes every submission created on or before the selected date.</p>
                        <input
                            type="date"
                            value={bulkDeleteDate}
                            onChange={(e) => setBulkDeleteDate(e.target.value)}
                            className="border-2 border-[#222D65] text-[#222D65] px-4 rounded-[15px] h-14 text-lg"
                        />
                        <label className="flex items-center gap-3 text-[16px] text-[#474747] !font-inter">
                            <Checkbox className="h-[22px] w-[22px]" checked={includeCheckedOut} onCheckedChange={(checked) => setIncludeCheckedOut(checked === true)} />
                            Also delete checked-out submissions
                        </label>
                        {bulkDeleteDate && (
                            <p className="text-[16px] font-semibold text-[#B20000] !font-inter">
                                This will delete {bulkDeleteCount} submission{bulkDeleteCount === 1 ? "" : "s"}.
                            </p>
                        )}
                        {bulkDeleteError && (
                            <p className="text-[16px] text-[#B20000] !font-inter">Deletion failed. Please try again.</p>
                        )}
                        <div className="flex flex-row justify-end gap-[15px]">
                            <Button variant='outline' className='!bg-white !border-[#222D65] !font-inter !text-[#222D65] !rounded-xl !px-[18px] !py-[5px]' onClick={closeBulkDelete}>Cancel</Button>
                            <Button className='!bg-[#B20000] text-white !font-inter !rounded-xl !px-[18px] !py-[5px]' disabled={!bulkDeleteDate || bulkDeleting} onClick={handleBulkDelete}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
            <div className="pl-[47px] pr-[47px] mt-[24px]">
                <div className="space-y-4">
                    <div className={`${rowLayout} rounded-xl bg-[#222d65] text-white h-[60px] mb-4 text-sm font-medium`} style={templateColumnsStyle}>
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
                                    <div className={`grid items-center content-center justify-items-center gap-x-6 h-full`} style={templateColumnsStyle}>
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
                                        <div className='flex flex-row gap-[15px] justify-self-center'>
                                            <Button variant='outline' className='!bg-[#E7F0FF] !border-[#222D65] !font-inter !font-[400] !text-[#222D65] !rounded-xl !px-[18px] !py-[5px]' onClick={() => router.push(`/admin/submissions/${s.id}/check-in${s.status === "Checked In" ? "" : "/edit"}`)}>{s.status === "Checked In" ? "View Check In" : "Check In"}</Button>
                                            <Button variant='outline' className='!bg-[#E7F0FF] !border-[#222D65] !font-inter !font-[400] !text-[#222D65] !rounded-xl !px-[18px] !py-[5px]' asChild>
                                                <Link href={`/admin/submissions/${s.id}`}>View</Link>
                                            </Button>
                                            <Button variant='outline' className='!bg-white !border-[#B20000] !font-inter !font-[400] !text-[#B20000] !rounded-xl !px-[18px] !py-[5px]' onClick={() => handleDelete(s.id)}>Delete</Button>
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
