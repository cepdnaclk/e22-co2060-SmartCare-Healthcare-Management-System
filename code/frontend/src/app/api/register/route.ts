import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
    try {
        const { name, email, password, role, specialized, availability } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'patient',
            specialization: specialized,
            availability,
        });

        await newUser.save();

        return NextResponse.json(
            { message: 'User created successfully', user: { name, email, role } },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Internal Server Error', error: error.message },
            { status: 500 }
        );
    }
}
