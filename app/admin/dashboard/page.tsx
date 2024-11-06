"use client"

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useEffect, useState } from 'react';

import { RecordModel } from 'pocketbase';
import { client } from '@/lib/pocketbase';

import Cookies from 'js-cookie';
import debounce from 'lodash/debounce';

import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import { AdminPagination } from '@/components/adminPagination';
import { AdminNew } from '@/components/adminNew';

import {
    LogOut,
    Globe,
    User,
    BriefcaseBusiness,
    FilePlus2
} from 'lucide-react';

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

    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [wasFocused, setWasFocused] = useState(false);

    const fetchNews = debounce(async () => {
        setLoading(true);
    
        let categoryFilters = [];
        if (empresas) categoryFilters.push("empresas = true");
        if (personas) categoryFilters.push("personasFisicas = true");
        if (internacional) categoryFilters.push("internacional = true");
    
        const categoryString = categoryFilters.length > 0 ? `(${categoryFilters.join(" || ")})` : '';
        const searchFilter = query ? `(title ~ "${query}" || author ~ "${query}" || content ~ "${query}")` : '';
        const filterString = categoryString && searchFilter ? `${categoryString} && ${searchFilter}` : categoryString || searchFilter;
    
        try {
            const response = await client.collection('news').getList(page, 5, {
                filter: filterString,
                sort: '-created',
            });
    
            setNews(response.items);
            setTotalPages(response.totalPages);
        } catch (error:any) {
            if (error.name === 'AbortError') {
                console.log('Request was cancelled');
            }
        } finally {
            setLoading(false);
        }
    }, 800);

    useEffect(() => {
        fetchNews();
        return () => fetchNews.cancel();
    }, [query, empresas, personas, internacional, page]);

    useEffect(() => {
        if (!empresas && !personas && !internacional) {
            setEmpresas(true);
            setPersonas(true);
            setInternacional(true);
        }
    }, [empresas, personas, internacional]);

    useEffect(() => {
        if (!loading && wasFocused) {
            inputRef.current?.focus();
        }
    }, [loading, wasFocused]);

    const handleLogout = () => {
        Cookies.remove('pb_auth');
        client.authStore.clear();
        router.push('/admin');
    };

    return (
        <>
            <div className="flex justify-between items-center py-4 shadow-sm px-12 md:px-14 lg:px-16 xl:px-24 2xl:px-28">
                <div className='flex space-x-8 items-center'>
                    <Link href="/">
                        <Image
                            alt="Logo MIAF Asesores"
                            src="/img/logoDark.png"
                            width={96}
                            height={40}
                            priority
                        />
                    </Link>
                    <h1 className='invisible sm:visible font-roboto font-normal text-miaf-gray-300 text-xl'>
                        Bienvenido <span className='font-bold'>{userName}</span>
                    </h1>
                </div>

                <Button variant="outline" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-col font-roboto text-miaf-gray-300 space-y-4 px-16 md:px-28 lg:px-32 xl:px-48 2xl:px-56 pt-8 pb-16 lg:space-y-8">
                <div className='flex flex-col space-y-4 lg:space-x-4 lg:space-y-0 lg:flex-row'>
                    <Input
                        ref={inputRef}
                        placeholder="Buscar por título, autor o parte del texto"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setWasFocused(true)}
                        onBlur={() => setWasFocused(false)}
                        disabled={loading}
                        className="flex-grow text-sm rounded-md h-10 px-4"
                    />
                    <div className="flex space-x-2 overflow-x-scroll sm:overflow-x-auto lg:min-w-fit">
                        <Toggle
                            key='empresas'
                            pressed={empresas}
                            onPressedChange={() => setEmpresas(prev => !prev)}
                            className='min-w-fit flex-grow'
                            disabled={loading}
                        >
                            <BriefcaseBusiness className='h-4 w-4 mr-2' />
                            Empresas
                        </Toggle>

                        <Toggle
                            key='personas'
                            pressed={personas}
                            onPressedChange={() => setPersonas(prev => !prev)}
                            className='min-w-fit flex-grow'
                            disabled={loading}
                        >
                            <User className='h-4 w-4 mr-2' />
                            Personas físicas
                        </Toggle>

                        <Toggle
                            key='internacional'
                            pressed={internacional}
                            onPressedChange={() => setInternacional(prev => !prev)}
                            className='min-w-fit flex-grow'
                            disabled={loading}
                        >
                            <Globe className='h-4 w-4 mr-2' />
                            Internacional
                        </Toggle>
                    </div>
                </div>

                <div className="space-y-4">
                    <div 
                        onClick={() => {}}
                        className="flex text-xl md:text-2xl items-center bg-miaf-blue-200 px-8 py-8 lg:px-12 lg:py-10 xl:px-14 xl:py-10 2xl:px-16 rounded-md text-white hover:bg-miaf-blue-100 transition"
                    >
                        <FilePlus2 className='h-8 w-8 md:h-10 md:w-10 mr-4'/>
                        Nuevo artículo
                    </div>

                    {(news.length == 0 && !loading) && (
                        <div className="flex justify-center pt-16 pb-32">
                            <p className='text-base text-miaf-gray-200 font-roboto text-center'>
                                No se encontró ningún artículo
                            </p>
                        </div>
                    )}

                    {loading && (
                        <div className="flex justify-center pt-16 pb-32">
                            <p className='text-base text-miaf-gray-200 font-roboto text-center'>
                                Cargando...
                            </p>
                        </div>
                    )}
                    
                    {!loading && (
                        news.map((newsItem) => (
                            <div key={newsItem.id}>
                                <AdminNew newsItem={newsItem}/>
                            </div>
                        ))
                    )}
                    
                </div>

                <AdminPagination page={page} totalPages={totalPages} setPage={(num:number) => {setPage(num)}}/>
            </div>
        </>

    );
}