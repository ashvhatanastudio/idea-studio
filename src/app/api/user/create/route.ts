import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();

    // Strict check: only 'admin' can create users
    if (session?.user?.name !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { username, password } = await req.json();

    if (!username || !password || password.length < 6) {
        return NextResponse.json(
            { error: "Invalid input. Password must be at least 6 characters." },
            { status: 400 }
        );
    }

    const existingUser = await prisma.user.findUnique({
        where: { username },
    });

    if (existingUser) {
        return NextResponse.json(
            { error: "Username already exists" },
            { status: 400 }
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            isTemporaryPassword: true, // Force change on first login
        },
    });

    return NextResponse.json({ success: true, user: { username: newUser.username } });
}
