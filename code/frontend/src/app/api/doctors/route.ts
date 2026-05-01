import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
    await connectToDatabase();
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        return NextResponse.json(doctors);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, email, password, specialization, availability, image } = await req.json();

        await connectToDatabase();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = new User({
            name,
            email,
            password: hashedPassword,
            role: 'doctor',
            specialization,
            availability, // expects array of strings
            image,
        });

        await newDoctor.save();

        return NextResponse.json(newDoctor, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
