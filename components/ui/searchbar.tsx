import * as React from 'react';
import { Input } from '@/components/ui/input.tsx';

export function SearchBar(text: string) {
    return (
        <div className='px-[47px] gap-[40px] flex flex-col w-[1635px] h-auto'>
            <p className='text-3xl font-semibold'>Submissions</p>
            <div className='flex-row'>
                <Input/>
            </div>
        </div>
    );
 }