import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.name) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
            { error: "Password must be at least 6 characters" },
            { status: 400 }
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and set isTemporaryPassword to false
    // We use the username from the session to identify the user
    await prisma.user.update({
        where: { username: session.user.name },
        data: {
            password: hashedPassword,
            isTemporaryPassword: false,
        },
    });

    return NextResponse.json({ success: true });
}
