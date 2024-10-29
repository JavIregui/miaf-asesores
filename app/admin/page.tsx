import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import Image from 'next/image';

export default function Admin() {

    return (
        <div className="bg-miaf-blue-300 w-full h-dvh flex justify-center items-center">
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
                    <div className="grid gap-4 text-miaf-gray-300 text-base font-roboto font-normal">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="1234@ejemplo.com"
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input id="password" type="password" required />
                        </div>

                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}