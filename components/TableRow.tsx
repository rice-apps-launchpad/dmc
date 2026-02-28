import * as React from 'react';

export function TableRow({ children }: { children: React.ReactNode }) {
    return (
    <div className="border border-[#9F9F9F]-400 rounded-3xl text-[14px] text-[#222d65] font-inter py-3 px-6 h-[55px]">
        {children}
    </div>)
}