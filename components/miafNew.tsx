import { RecordModel } from 'pocketbase';
import { useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface NewProps {
    newsItem: RecordModel;
}

export const MiafNew = ({ newsItem }: NewProps) => {

    const [isHovered, setIsHovered] = useState(false);

    return (
        <Dialog>

            <DialogTrigger asChild>

                <div
                    className="bg-center bg-cover shadow-sm h-80 w-full cursor-pointer"
                    style={{ backgroundImage: `url(https://miaf.pockethost.io/api/files/${newsItem.collectionId}/${newsItem.id}/${newsItem.image})` }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="h-full flex flex-col justify-end bg-gradient-to-t from-[#000000c8] to-[#00000032] text-white px-8 py-8 lg:px-12 lg:py-10">
                        <div className={`flex flex-col space-y-2 ${isHovered ? 'mb-1' : ''} transition-all duration-300`}>
                            <div>
                                <h2 className="text-2xl font-playfair">{newsItem.title}</h2>
                                <p className="text-miaf-gray-150 font-roboto font-light text-sm">{newsItem.author}</p>
                            </div>

                            <div
                                className="text-base line-clamp-3 font-roboto"
                                dangerouslySetInnerHTML={{ __html: newsItem.content }}
                            />
                        </div>

                    </div>
                </div>

            </DialogTrigger>

            <DialogContent>

                <DialogHeader image={`url(https://miaf.pockethost.io/api/files/${newsItem.collectionId}/${newsItem.id}/${newsItem.image})`}>

                    <div className="h-full flex flex-col space-y-1 justify-end bg-gradient-to-t from-[#000000c8] to-[#00000032] text-white px-8 pb-4 pt-16 lg:pt-4 lg:px-12">
                        <DialogTitle>{newsItem.title}</DialogTitle>
                        <DialogDescription>{newsItem.author}</DialogDescription>
                    </div>

                </DialogHeader>

                <div
                    className="overflow-y-auto text-base font-sans px-8 py-8 lg:px-12"
                    dangerouslySetInnerHTML={{ __html: newsItem.content.replace(/<p>/g, '<p class="pb-2">'), }}
                />

            </DialogContent>

        </Dialog>
    );
};