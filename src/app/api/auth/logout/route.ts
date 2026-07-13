import { NextResponse } from "next/server";
import { logout } from "@/services/auth";
export async function GET(request: Request) {
    try {
        await logout();
        return NextResponse.redirect(new URL("/", request.url));
    }
    catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Logout failed" },
            { status: 500 }
        );
    }
}