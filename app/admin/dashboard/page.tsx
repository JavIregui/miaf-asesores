"use client"

import { Button } from '@/components/ui/button';
import { client } from '@/lib/pocketbase';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Admin() {

    const [userName, setUserName] = useState('Usuario invitado');

    useEffect(() => {
        if (client.authStore.isValid) {
            setUserName(client.authStore.model?.name || 'Usuario invitado');
        }
    }, []);

    return (
        <>
            <div className="max-w-dvw flex justify-between items-center py-4 shadow-sm px-12 md:px-10 lg:px-16 xl:px-24 2xl:px-28">
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

                <Button variant="miaf" size="miafSmall">
                    Cerrar sesión
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </>
        
    );
}