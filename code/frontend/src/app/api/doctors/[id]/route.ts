import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    await connectToDatabase();
    const { id } = await params;
    try {
        const doctor = await User.findById(id).select('-password');
        if (!doctor || doctor.role !== 'doctor') {
            return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
        }
        return NextResponse.json(doctor);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Allow admin or the doctor themselves to update
    if (session.user.role !== 'admin' && session.user.id !== id) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    try {
        const { name, email, specialization, availability, image } = await req.json();
        await connectToDatabase();

        const updatedDoctor = await User.findByIdAndUpdate(
            id,
            { name, email, specialization, availability, image },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedDoctor) {
            return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
        }

        return NextResponse.json(updatedDoctor);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const deletedDoctor = await User.findByIdAndDelete(id);

        if (!deletedDoctor) {
            return NextResponse.json({ message: 'Doctor not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Doctor deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
