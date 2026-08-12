import { NextResponse } from "next/server";
import { logout } from "@/services/auth";
export async function GET(request: Request) {
    try {
        await logout();
        const baseUrl = process.env.APP_URL;

        return NextResponse.redirect(new URL("/", baseUrl));
    }
    catch (e) {
        console.error(e);
        return NextResponse.json(
            { error: "Logout failed" },
            { status: 500 }
        );
    }
}