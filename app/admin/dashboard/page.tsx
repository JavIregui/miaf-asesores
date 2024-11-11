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
    LogOut,
    Globe,
    User,
    BriefcaseBusiness,
    FilePlus2
} from 'lucide-react';
import { Label } from '@/components/ui/label';

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FormError } from '@/components/form-error';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

import { Bold, Italic } from "lucide-react"
 
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

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

    const [newOpen, setNewOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        author: '',
        content: '',
        image: null as File | null,
        public: false,
        empresas: true,
        personas: true,
        internacional: true
    });

    const editor = useEditor({
        extensions: [StarterKit],
        content: formData.content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setFormData(prev => ({
                ...prev,
                content: editor.getHTML(),
            }));
        },
    });

    useEffect(() => {
        if (!formData.empresas && !formData.personas && !formData.internacional) {
            setFormData(prev => ({
                ...prev,
                empresas: true,
                personas: true,
                internacional: true
            }));
        }
    }, [formData.empresas, formData.personas, formData.internacional]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const fetchNews = debounce(async () => {
        setLoading(true);

        const categoryFilters = [];
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

    const handleDelete = async (id: string) => {
        try {
            await client.collection('news').delete(id);
            fetchNews();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleEdit = async (id: string, data: FormData) => {
        try {
            await client.collection('news').update(id, data);
            fetchNews();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const handleNew = async () => {
        setError(false);
        setCreating(true);

        const form = new FormData();
        form.append("title", formData.title);
        form.append("author", formData.author);
        form.append("content", formData.content);
        form.append("public", formData.public.toString());
        form.append("empresas", formData.empresas.toString());
        form.append("personasFisicas", formData.personas.toString());
        form.append("internacional", formData.internacional.toString());

        if (formData.image) {
            form.append("image", formData.image);
        }

        try {
            await client.collection('news').create(form);
        } catch (error) {
            console.error('Error editing item:', error);
        } finally {
            setFormData({
                title: '',
                author: '',
                content: '',
                image: null as File | null,
                public: false,
                empresas: true,
                personas: true,
                internacional: true
            });
            setNewOpen(false);
            setCreating(false);
            fetchNews();
        }
    };

    const handleError = async () => {
        setError(true);
        await new Promise(resolve => setTimeout(resolve, 250));
        setNewOpen(true);
    }

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
                        Bienvenido/a <span className='font-bold'>{userName}</span>
                    </h1>
                </div>

                <Button variant="outline" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-col font-roboto text-miaf-gray-300 space-y-4 px-8 md:px-28 lg:px-32 xl:px-48 2xl:px-56 pt-8 pb-16 lg:space-y-8">
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

                    <EditDialog open={newOpen} onOpenChange={setNewOpen}>

                        <EditDialogTrigger asChild>

                            <div
                                onClick={() => { }}
                                className="flex text-xl md:text-2xl items-center bg-miaf-blue-200 px-8 py-8 lg:px-12 lg:py-10 xl:px-14 xl:py-10 2xl:px-16 rounded-md text-white hover:bg-miaf-blue-100 transition"
                            >
                                <FilePlus2 className='h-8 w-8 md:h-10 md:w-10 mr-4' />
                                Nuevo artículo
                            </div>

                        </EditDialogTrigger>

                        <EditDialogContent>

                            <EditDialogHeader>

                                <EditDialogTitle>Nuevo artículo</EditDialogTitle>
                                <EditDialogDescription></EditDialogDescription>

                            </EditDialogHeader>

                            <form className="flex flex-col space-y-4 px-2 md:px-8 font-roboto flex-grow overflow-y-auto">
                                <div className="flex flex-col space-x-0 space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
                                    <div className="space-y-1 flex-grow">
                                        <Label className='text-lg' htmlFor="title">Título</Label>
                                        <Input
                                            id="title"
                                            name="title"
                                            className='text-sm rounded-md h-10 px-4'
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Escribe el título del artículo"
                                        />
                                    </div>

                                    <div className="space-y-1 flex-grow md:flex-grow-0 md:w-1/3 lg:w-1/4">
                                        <Label className='text-lg' htmlFor="author">Autor</Label>
                                        <Input
                                            id="author"
                                            name="author"
                                            className='text-sm rounded-md h-10 px-4'
                                            value={formData.author}
                                            onChange={handleChange}
                                            placeholder="Escribe el nombre del autor"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col space-x-0 space-y-4 md:space-y-8 lg:space-x-8 lg:flex-row">
                                    <div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-end'>
                                        <div className="space-y-1">
                                            <Label className='text-lg' htmlFor="image">Imagen</Label>
                                            <Input
                                                id="image"
                                                name="mage"
                                                className='text-sm rounded-md h-10 px-4 hover:bg-miaf-gray-100/25 cursor-pointer'
                                                type='file'
                                                onChange={(e) => {
                                                    const file = e.target.files ? e.target.files[0] : null;
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        image: file,
                                                    }));
                                                }}
                                            />
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Label className='text-lg' htmlFor="public">Público</Label>
                                            <Switch
                                                id="public"
                                                checked={formData.public}
                                                onCheckedChange={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        public: !formData.public,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className='flex flex-col min-w-fit space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-end'>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={formData.empresas}
                                                onCheckedChange={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        empresas: !formData.empresas,
                                                    }));
                                                }}
                                                id="empresas"
                                            />
                                            <Label className='text-base lg:text-lg' htmlFor="empresas">Empresas</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={formData.personas}
                                                onCheckedChange={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        personas: !formData.personas,
                                                    }));
                                                }}
                                                id="personas"
                                            />
                                            <Label className='text-base lg:text-lg' htmlFor="personas">Personas físicas</Label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={formData.internacional}
                                                onCheckedChange={() => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        internacional: !formData.internacional,
                                                    }));
                                                }}
                                                id="internacional"
                                            />
                                            <Label className='text-base lg:text-lg' htmlFor="internacional">Internacional</Label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow space-y-1">
                                    <div className="flex items-baseline space-x-4">
                                        <Label className='text-lg' htmlFor="content">Contenido</Label>

                                        <ToggleGroup type="multiple">
                                            <ToggleGroupItem value="bold" aria-label="Toggle bold" onClick={() => {editor?.chain().focus().toggleBold().run()}}>
                                                <Bold className="h-4 w-4" />
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="italic" aria-label="Toggle italic" onClick={() => {editor?.chain().focus().toggleItalic().run()}}>
                                                <Italic className="h-4 w-4" />
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>

                                    <div onClick={() => editor?.commands.focus()} className="border px-4 py-2 rounded-md flex-grow">
                                        <EditorContent className='font-sans' editor={editor} />
                                    </div>
                                </div>

                            </form>

                            {error && (
                                <FormError message="La imagen es obligatoria" />
                            )}

                            <EditDialogFooter className='pt-4'>

                                <EditDialogCancel onClick={() => {
                                    setFormData({
                                        title: '',
                                        author: '',
                                        content: '',
                                        image: null as File | null,
                                        public: false,
                                        empresas: true,
                                        personas: true,
                                        internacional: true
                                    });
                                }}>Cancelar</EditDialogCancel>

                                <EditDialogAction variant='default' onClick={(!formData.image) ? handleError : handleNew} disabled={creating}>
                                    {creating ? 'Guardando...' : 'Guardar'}
                                </EditDialogAction>

                            </EditDialogFooter>

                        </EditDialogContent>

                    </EditDialog>

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
                                <AdminNew newsItem={newsItem} onDelete={handleDelete} onEdit={handleEdit} />
                            </div>
                        ))
                    )}

                </div>

                <AdminPagination page={page} totalPages={totalPages} setPage={(num: number) => { setPage(num) }} />
            </div>
        </>

    );
}