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

interface NewProps {
    newsItem: RecordModel;
    onDelete: (id: string) => Promise<void>;
    onEdit: (id: string, formData: FormData) => Promise<void>;
}

export const AdminNew = ({ newsItem, onDelete, onEdit }: NewProps) => {

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [formData, setFormData] = useState({
        title: newsItem.title,
        author: newsItem.author,
        content: newsItem.content,
        image: null as File | null,
        public: newsItem.public,
        empresas: newsItem.empresas,
        personas: newsItem.personasFisicas,
        internacional: newsItem.internacional
    });

    const editor = useEditor({
        extensions: [StarterKit],
        content: newsItem.content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            setFormData(prev => ({
                ...prev,
                content: editor.getHTML(),
            }));
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await onDelete(newsItem.id);
        } catch (error) {
            console.error('Error deleting item:', error);
        } finally {
            setDeleteOpen(false);
            setDeleting(false);
        }
    };

    const handleEdit = async () => {
        setUpdating(true);

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
            await onEdit(newsItem.id, form);
        } catch (error) {
            console.error('Error editing item:', error);
        } finally {
            setEditOpen(false);
            setUpdating(false);
        }
    };

    useEffect(() => {
        if(!formData.empresas && !formData.personas && !formData.internacional){
            setFormData(prev => ({
                ...prev,
                empresas: true,
                personas: true,
                internacional: true
            }));
        }
    }, [formData.empresas, formData.personas, formData.internacional]);

    return (
        <div key={newsItem.id}>
            <div
                className="bg-center bg-cover shadow-sm rounded-md h-80"
                style={{ backgroundImage: `url(https://miaf.pockethost.io/api/files/${newsItem.collectionId}/${newsItem.id}/${newsItem.image})` }}
            >
                <div className="h-full rounded-md flex flex-col justify-between bg-gradient-to-t from-[#000000c8] to-[#00000032] text-white px-8 py-8 lg:px-12 lg:py-10 xl:px-14 xl:py-10 2xl:px-16">
                    <div className='flex flex-row justify-end space-x-2'>
                        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>

                            <AlertDialogTrigger asChild>

                                <Button variant="adminDestructive" size="sm" onClick={() => setDeleteOpen(true)}>

                                    <Trash2 className='h-4 w-4' />
                                    Eliminar

                                </Button>

                            </AlertDialogTrigger>

                            <AlertDialogContent>

                                <AlertDialogHeader>

                                    <AlertDialogTitle>Eliminar artículo?</AlertDialogTitle>

                                    <AlertDialogDescription>
                                        Esta acción no se puede deshacer. Este artículo será borrado permanentemente.
                                    </AlertDialogDescription>

                                </AlertDialogHeader>

                                <AlertDialogFooter>

                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    
                                    <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                                        {deleting ? 'Eliminando...' : 'Eliminar'}
                                    </AlertDialogAction>

                                </AlertDialogFooter>

                            </AlertDialogContent>

                        </AlertDialog>

                        <EditDialog open={editOpen} onOpenChange={setEditOpen}>

                            <EditDialogTrigger asChild>

                                <Button variant="adminEdit" size="sm">

                                    <SquarePen className='h-4 w-4' />
                                    Editar

                                </Button>

                            </EditDialogTrigger>

                            <EditDialogContent>

                                <EditDialogHeader>

                                    <EditDialogTitle>Editor de artículos</EditDialogTitle>
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
                                                    onCheckedChange={()=>{setFormData(prev => ({
                                                        ...prev,
                                                        public: !formData.public,
                                                    }));}}
                                                />
                                            </div>
                                        </div>

                                        <div className='flex flex-col min-w-fit space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-end'>
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={formData.empresas} 
                                                    onCheckedChange={()=>{setFormData(prev => ({
                                                        ...prev,
                                                        empresas: !formData.empresas,
                                                    }));}}
                                                    id="empresas" 
                                                />
                                                <Label className='text-base lg:text-lg' htmlFor="empresas">Empresas</Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={formData.personas} 
                                                    onCheckedChange={()=>{setFormData(prev => ({
                                                        ...prev,
                                                        personas: !formData.personas,
                                                    }));}}
                                                    id="personas" 
                                                />
                                                <Label className='text-base lg:text-lg' htmlFor="personas">Personas físicas</Label>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    checked={formData.internacional} 
                                                    onCheckedChange={()=>{setFormData(prev => ({
                                                        ...prev,
                                                        internacional: !formData.internacional,
                                                    }));}}
                                                    id="internacional" 
                                                />
                                                <Label className='text-base lg:text-lg' htmlFor="internacional">Internacional</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col flex-grow space-y-1">
                                        <Label className='text-lg' htmlFor="content">Contenido</Label>
                                        <div className="border px-4 py-2 rounded-md flex-grow">
                                            <EditorContent editor={editor} />
                                        </div>
                                    </div>
                                </form>

                                <EditDialogFooter className='pt-4'>

                                    <EditDialogCancel>Cancelar</EditDialogCancel>
                                    
                                    <EditDialogAction variant='default' onClick={(!newsItem.image && !formData.image) ? () => {console.log("Imágen obligatoria")} : handleEdit} disabled={updating}>
                                        {updating ? 'Guardando...' : 'Guardar'}
                                    </EditDialogAction>

                                </EditDialogFooter>

                            </EditDialogContent>

                        </EditDialog>
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
                            className="text-base line-clamp-3"
                            dangerouslySetInnerHTML={{ __html: newsItem.content }}
                        />
                    </div>

                </div>
            </div>
        </div>
    );
};