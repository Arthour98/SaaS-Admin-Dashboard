import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createUserByOauth } from "./src/services/auth";
import { UserProps } from "@/db/queries/users";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],

    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) {
                return false;
            }

            const user_name =
                profile.name ?? profile.email.split("@")[0];

            const source =
                account?.provider ?? "oauth";

            const result = await createUserByOauth({
                user_name,
                password: "",
                email: profile.email,
                source,
            } as UserProps);

            if (result && "error" in result) {
                console.error(
                    "OAuth user creation failed:",
                );

                return false;
            }

            return true;
        },

        async redirect({ url, baseUrl }) {
            return `${baseUrl}/auth-verification`;
        },
    },
});