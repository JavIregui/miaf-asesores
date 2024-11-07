import { RecordModel } from 'pocketbase';
import { Button } from '@/components/ui/button';

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

import { useState } from 'react';

interface NewProps {
    newsItem: RecordModel;
    onDelete: (id: string) => Promise<void>;
    onEdit: (/*aqui me falta el tipo de datos que recibe la función*/) => Promise<void>;
}

export const AdminNew = ({ newsItem, onDelete, onEdit }: NewProps) => {

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

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
        try {
            //await onEdit(/*Tiene que recibir el objeto con los nuevos datos que hay en el form*/);
        } catch (error) {
            console.error('Error editing item:', error);
        } finally {
            setEditOpen(false);
            setUpdating(false);
        }
    };

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

                                    <EditDialogTitle>Editar artículo</EditDialogTitle>

                                    <EditDialogDescription>
                                        Aquí se va a poder editar el  artículo
                                    </EditDialogDescription>

                                </EditDialogHeader>

                                <EditDialogFooter>

                                    <EditDialogCancel>Cancelar</EditDialogCancel>
                                    
                                    <EditDialogAction onClick={handleEdit} disabled={updating}>
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