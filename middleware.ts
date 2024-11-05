import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { client } from "./lib/pocketbase";

export async function middleware(req: NextRequest) {
    const cookie = req.cookies.get("pb_auth")?.value;

    if (!cookie) {
        client.authStore.clear();
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
    }
    client.authStore.save(cookie);
    
    await client.collection('users').authRefresh();
    const isAuthenticated = client.authStore.isValid;

    if (!isAuthenticated) {
        client.authStore.clear();
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path((?!$).*)",
    ],
};
