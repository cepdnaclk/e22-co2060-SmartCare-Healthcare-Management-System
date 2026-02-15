import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Appointment from '@/models/Appointment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { status, notes } = await req.json();
        await connectToDatabase();

        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
        }

        // Authorization checks
        if (session.user.role === 'patient' && appointment.patient.toString() !== session.user.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
        if (session.user.role === 'doctor' && appointment.doctor.toString() !== session.user.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }
        // Admin allowed

        // Logic for allowed status changes could be refined here
        // e.g. Patient can only cancel?

        if (status) appointment.status = status;
        if (notes) appointment.notes = notes;

        await appointment.save();

        return NextResponse.json(appointment);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await connectToDatabase();
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return NextResponse.json({ message: 'Appointment not found' }, { status: 404 });
        }

        if (session.user.role !== 'admin' && appointment.patient.toString() !== session.user.id && appointment.doctor.toString() !== session.user.id) {
            return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
        }

        await Appointment.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Appointment deleted successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
