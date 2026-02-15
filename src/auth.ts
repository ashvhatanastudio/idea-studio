import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials): Promise<any> {
                if (!credentials?.username || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username as string },
                });

                if (!user) return null;

                const passwordMatch = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!passwordMatch) return null;

                return {
                    id: user.id,
                    name: user.username,
                    isTemporaryPassword: user.isTemporaryPassword,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.isTemporaryPassword = (user as any).isTemporaryPassword;
            }
            if (trigger === "update" && session?.isTemporaryPassword !== undefined) {
                token.isTemporaryPassword = session.isTemporaryPassword;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).isTemporaryPassword = token.isTemporaryPassword;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isTemporaryPassword = (auth?.user as any)?.isTemporaryPassword;
            const isOnDashboard = nextUrl.pathname === "/";
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnChangePassword = nextUrl.pathname === "/change-password";

            if (isLoggedIn && isTemporaryPassword) {
                if (!isOnChangePassword) {
                    return Response.redirect(new URL("/change-password", nextUrl));
                }
                return true;
            }

            if (isOnDashboard || isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                if (nextUrl.pathname === "/login") {
                    return Response.redirect(new URL("/", nextUrl));
                }
            }
            return true;
        },
    },
});
