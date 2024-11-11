"use client"

import Head from 'next/head';
import { Input } from '@/components/ui/input';
import { useRef, useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import { RecordModel } from 'pocketbase';
import { client } from '@/lib/pocketbase';
import { AdminPagination } from '@/components/adminPagination';
import { MiafNew } from '@/components/miafNew';

export default function Personas() {

    const [news, setNews] = useState<RecordModel[]>([]);

    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const [wasFocused, setWasFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchNews = debounce(async () => {
        setLoading(true);

        const categoryString = "personasFisicas = true";
        const searchFilter = query ? `(title ~ "${query}" || author ~ "${query}" || content ~ "${query}")` : '';
        const filterString = categoryString && searchFilter ? `${categoryString} && ${searchFilter}` : categoryString || searchFilter;

        try {
            const response = await client.collection('news').getList(page, 6, {
                filter: filterString,
                sort: '-created',
            });

            setNews(response.items);
            setTotalPages(response.totalPages);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
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
    }, [query, page]);

    useEffect(() => {
        if (!loading && wasFocused) {
            inputRef.current?.focus();
        }
    }, [loading, wasFocused]);

    return (
        <>
            <Head>
                <link rel="preload" href="/personasBg.jpg" as="image" />
            </Head>

            <div>
                <section className="bg-[url('/img/personasBg.jpg')] bg-center bg-cover">
                    <div className="bg-gradient-to-t from-[#000000cc] to-[#00000032] flex flex-col justi pb-16 pt-32 px-12 md:px-10 lg:px-16 xl:px-24 2xl:px-28">
                        <h2 className="font-playfair font-normal text-4xl text-white w-full md:w-3/5 lg:w-1/2 xl:w-4/12">
                            Personas físicas
                        </h2>
                    </div>
                </section>

                <section className='flex flex-col space-y-8 pt-8 pb-24 px-12 md:px-10 lg:px-16 xl:px-24 2xl:px-28'>

                    <Input
                        ref={inputRef}
                        placeholder="Buscar por título, autor o parte del texto"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setWasFocused(true)}
                        onBlur={() => setWasFocused(false)}
                        disabled={loading}
                        className="flex-grow md:w-1/2 lg:w-1/3 text-sm h-10 px-4 focus-visible:ring-miaf-blue-100"
                    />

                    {loading && (
                        <div className='flex flex-col space-y-8'>
                            <div className='flex flex-col space-y-8 lg:space-y-0 lg:flex-row lg:space-x-8'>
                                <div className='flex-grow h-64 bg-miaf-gray-150/50 animate-pulse'>

                                </div>
                                <div className='flex-grow h-64 bg-miaf-gray-150/75 animate-pulse'>

                                </div>
                            </div>
                            <div className='flex flex-col space-y-8 lg:space-y-0 lg:flex-row lg:space-x-8'>
                                <div className='flex-grow h-64 bg-miaf-gray-150/25 animate-pulse'>

                                </div>
                                <div className='flex-grow h-64 bg-miaf-gray-150/50 animate-pulse'>

                                </div>
                            </div>
                        </div>
                    )}

                    {(news.length == 0 && !loading) && (
                        <div className="flex justify-center pt-16 pb-32">
                            <p className='text-base text-miaf-gray-200 font-roboto text-center'>
                                Todavía no hay artículos
                            </p>
                        </div>
                    )}

                    {!loading && (
                        <div className="flex flex-col space-y-4 lg:space-y-8">
                            {news.reduce((rows, newsItem, index) => {
                                if (index % 2 === 0) {
                                    rows.push([newsItem]);
                                } else {
                                    rows[rows.length - 1].push(newsItem);
                                }
                                return rows;
                            }, [] as RecordModel[][]).map((row, rowIndex) => (
                                <div key={rowIndex} className="flex flex-col space-y-4 md:space-y-8 lg:space-y-0 lg:flex-row lg:space-x-8">
                                    {row.map((newsItem) => (
                                        <MiafNew key={newsItem.id} newsItem={newsItem} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}

                    <AdminPagination page={page} totalPages={totalPages} setPage={(num: number) => { setPage(num) }} />
                </section>
                
            </div>
        </>
    );
}