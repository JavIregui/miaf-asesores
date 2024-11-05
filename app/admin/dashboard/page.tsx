"use client"

import { Button } from '@/components/ui/button';
import { client } from '@/lib/pocketbase';
import { LogOut, Globe, User, BriefcaseBusiness } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { RecordModel, ListResult } from 'pocketbase';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { 
    Pagination, 
    PaginationContent, 
    PaginationEllipsis, 
    PaginationItem, 
    PaginationLink, 
    PaginationNext, 
    PaginationPrevious 
} from '@/components/ui/pagination';

export default function Dashboard() {

    const router = useRouter();

    const [userName, setUserName] = useState('Usuario invitado');

    useEffect(() => {
        if (client.authStore.isValid) {
            setUserName(client.authStore.model?.name || 'Usuario invitado');
        }
    }, []);

    const [news, setNews] = useState<RecordModel[]>([]);

    const [empresas, setEmpresas] = useState(true);
    const [personas, setPersonas] = useState(true);
    const [internacional, setInternacional] = useState(true);
    const [query, setQuery] = useState('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNews = async () => {
        const controller = new AbortController();
        const { signal } = controller;

        let categoryFilters = [];
        if (empresas) categoryFilters.push("empresas = true");
        if (personas) categoryFilters.push("personasFisicas = true");
        if (internacional) categoryFilters.push("internacional = true");

        const categoryString = categoryFilters.length > 0 ? `(${categoryFilters.join(" || ")})` : '';
        const searchFilter = query ? `(title ~ "${query}" || author ~ "${query}" || content ~ "${query}")` : '';
        const filterString = categoryString && searchFilter ? `${categoryString} && ${searchFilter}` : categoryString || searchFilter;

        try {
            const response: ListResult<RecordModel> = await client.collection('news').getList(page, 5, {
                filter: filterString,
                sort: '-created',
                signal,
            });

            setNews(response.items);
            setTotalPages(response.totalPages);
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Request was cancelled');
            } else {
                console.error('Error fetching news:', error);
            }
        }

        return () => controller.abort();
    };

    useEffect(() => {
        fetchNews();
    }, [query, empresas, personas, internacional, page]);

    useEffect(() => {
        if (!empresas && !personas && !internacional) {
            setEmpresas(true);
            setPersonas(true);
            setInternacional(true);
        }
    }, [empresas, personas, internacional]);

    const handleLogout = () => {
        Cookies.remove('pb_auth');
        client.authStore.clear();
        router.push('/admin');
    };

    return (
        <>
            <div className="flex justify-between items-center py-4 shadow-sm px-12 md:px-14 lg:px-16 xl:px-24 2xl:px-28">
                <div className='flex space-x-8 items-center'>
                    <Image
                        alt="Logo MIAF Asesores"
                        src="/img/logoDark.png"
                        width={96}
                        height={40}
                        priority
                    />
                    <h1 className='invisible sm:visible font-roboto font-normal text-miaf-gray-300 text-xl'>
                        Bienvenido <span className='font-bold'>{userName}</span>
                    </h1>
                </div>

                <Button variant="outline" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-col space-y-4 px-16 md:px-28 lg:px-32 xl:px-48 2xl:px-56 pt-8 pb-16 lg:space-y-8">
                <div className='flex flex-col space-y-4 lg:space-x-4 lg:space-y-0 lg:flex-row'>
                    <Input
                        placeholder="Buscar por título, autor o parte del texto"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-grow text-sm rounded-md h-10 px-4"
                    />
                    <div className="flex space-x-2 overflow-x-scroll sm:overflow-x-auto lg:min-w-fit">
                        <Toggle
                            key='empresas'
                            pressed={empresas}
                            onPressedChange={() => setEmpresas(prev => !prev)}
                            className='min-w-fit flex-grow'
                        >
                            <BriefcaseBusiness className='h-4 w-4 mr-2' />
                            Empresas
                        </Toggle>

                        <Toggle
                            key='personas'
                            pressed={personas}
                            onPressedChange={() => setPersonas(prev => !prev)}
                            className='min-w-fit flex-grow'
                        >
                            <User className='h-4 w-4 mr-2' />
                            Personas físicas
                        </Toggle>

                        <Toggle
                            key='internacional'
                            pressed={internacional}
                            onPressedChange={() => setInternacional(prev => !prev)}
                            className='min-w-fit flex-grow'
                        >
                            <Globe className='h-4 w-4 mr-2' />
                            Internacional
                        </Toggle>
                    </div>
                </div>

                <div className="space-y-4">
                    {news.map((newsItem) => (
                        <div key={newsItem.id} className="p-4 shadow rounded bg-white">
                            <h2 className="font-bold text-lg">{newsItem.title}</h2>
                            <p>{newsItem.author}</p>
                            <p className="text-sm text-gray-600">{newsItem.content}</p>
                        </div>
                    ))}
                </div>

                <div className="max-w-fit flex space-x-2">
                    <Pagination>
                        <PaginationContent>

                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={page > 1 ? () => setPage(page-1) : undefined}
                                    className={page === 1 ? "text-gray-400 pointer-events-none" : ""}
                                />
                            </PaginationItem>

                            {page-2 > 0 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            {page-1 > 0 && (
                                <PaginationItem>
                                    <PaginationLink onClick={() => setPage(page-1)}>
                                        {page-1}
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationLink isActive>
                                    {page}
                                </PaginationLink>
                            </PaginationItem>

                            {page <= totalPages-1 && (
                                <PaginationItem>
                                    <PaginationLink onClick={() => setPage(page+1)}>
                                        {page+1}
                                    </PaginationLink>
                                </PaginationItem>
                            )}

                            {page <= totalPages-2 && (
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={page < totalPages ? () => setPage(page+1) : undefined}
                                    className={page === totalPages ? "text-gray-400 pointer-events-none" : ""}
                                />
                            </PaginationItem>

                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </>

    );
}