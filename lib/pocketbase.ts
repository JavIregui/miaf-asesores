import PocketBase from 'pocketbase';

const url = 'https://miaf.pockethost.io/'
export const client = new PocketBase(url)

export async function register(registerData: {
    email: string;
    name: string;
    lastname: string;
    password: string;
    passwordConfirm: string;
}): Promise<{ success: boolean; message: string }> {
    const data = {
        username: `${registerData.name}${registerData.lastname}`,
        email: registerData.email,
        name: registerData.name,
        lastname: registerData.lastname,
        password: registerData.password,
        passwordConfirm: registerData.passwordConfirm,
    };

    try {
        await client.collection('users').create(data);
        return { success: true, message: "Registro exitoso" };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return { success: false, message: error.message || "Error en el registro" };
    }
}

export async function login(loginData: {
    email: string;
    password: string;
}): Promise<{ success: boolean; token?: string; message: string }> {
    try {
        const authData = await client.collection('users').authWithPassword(
            loginData.email,
            loginData.password
        );
        
        return { success: true, token: authData.token, message: "Login exitoso" };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        return { success: false, message: error.message || "Error en el login" };
    }
}