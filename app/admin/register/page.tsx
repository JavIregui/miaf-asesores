"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import Image from 'next/image';

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import { RegisterSchema } from "@/schemas";
import { register } from "@/lib/pocketbase";

import { useRouter } from 'next/navigation';

import { useState } from "react";
import { FormError } from "@/components/form-error";

export default function Admin() {

    const router = useRouter();

    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            name: "",
            lastname: "",
            password: "",
            passwordConfirm: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
        setIsLoading(true);

        const result = await register(values);

        if (result.success) {
            form.reset();
            setError(false);
            router.push("/admin");
        } else {
            console.error(result.message);
            setError(true);
        }

        setIsLoading(false);
    };

    return (
        <div className="bg-miaf-blue-300 w-full min-h-dvh py-16 flex justify-center items-center">
            <Card className="w-72 sm:w-80 flex flex-col gap-8 items-center p-8">
                <CardHeader className="p-0">
                    <Image
                        alt="Logo MIAF Asesores"
                        src="/img/logoDark.png"
                        width={150}
                        height={200}
                        priority
                    />
                </CardHeader>

                <CardContent className="p-0 w-full">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6 text-miaf-gray-300 font-roboto"
                        >
                            <div className="space-y-4">
                                <div className="flex space-x-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Nombre</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastname"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-base">Apellidos</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        type="text"
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="ejemplo@mail.com"
                                                    type="email"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Contraseña</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="******"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="passwordConfirm"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-base">Repetir contraseña</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="******"
                                                    type="password"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {error && (
                                <FormError message="Error en el registro"/>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Cargando..." : "Registrarse"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}