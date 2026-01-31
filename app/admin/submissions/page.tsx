 import * as React from "react"
 import mockSubmissions from "@/lib/mock_submissions.json";
 import { SearchBar } from "@/components/ui/HeaderSearch";
 
 export default function Page() {
    console.log(mockSubmissions);
    return (
        SearchBar("Submissions")
    );

    // title

    // search bar

    // table of submissions
    
    // collapsible submissions
 }
