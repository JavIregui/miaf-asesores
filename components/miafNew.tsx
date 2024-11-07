import { RecordModel } from 'pocketbase';

import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    EditDialog,
    EditDialogAction,
    EditDialogCancel,
    EditDialogContent,
    EditDialogDescription,
    EditDialogFooter,
    EditDialogHeader,
    EditDialogTitle,
    EditDialogTrigger,
} from "@/components/ui/edit-dialog"

import {
    Trash2,
    SquarePen
} from 'lucide-react';

import { useState, useEffect } from 'react';

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FormError } from './form-error';

import { Bold, Italic } from "lucide-react"
 
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

interface NewProps {
    newsItem: RecordModel;
}

export const MiafNew = ({ newsItem }: NewProps) => {

    return (
        <div key={newsItem.id}>
            <div
                className="bg-center bg-cover shadow-sm rounded-md h-80"
                style={{ backgroundImage: `url(https://miaf.pockethost.io/api/files/${newsItem.collectionId}/${newsItem.id}/${newsItem.image})` }}
            >
                <div className="h-full rounded-md flex flex-col justify-between bg-gradient-to-t from-[#000000c8] to-[#00000032] text-white px-8 py-8 lg:px-12 lg:py-10 xl:px-14 xl:py-10 2xl:px-16">
                    <div className='flex flex-row justify-end space-x-2'>
                    </div>
                    <div className='flex flex-col space-y-4'>
                        <div>
                            <div className='flex space-x-2 items-baseline'>
                                <h2 className="text-2xl">{newsItem.title}</h2>
                                {!newsItem.public && (
                                    <p className='text-base text-destructive'>(Borrador)</p>
                                )}
                            </div>

                            <p className="text-miaf-gray-150 font-light text-sm">{newsItem.author}</p>
                        </div>

                        <div
                            className="text-base line-clamp-3 font-sans"
                            dangerouslySetInnerHTML={{ __html: newsItem.content }}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};