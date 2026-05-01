import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Appointment from '@/models/Appointment';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { doctorId, date, reason } = await req.json();

        if (!doctorId || !date) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        await connectToDatabase();

        // Check Doctor Availability (Optional: Validate if date matches doctor's slots)
        // For now, we assume the UI only shows valid slots.

        // Capacity Check: Max 4 patients per slot
        const existingAppointments = await Appointment.countDocuments({
            doctor: doctorId,
            date: date,
            status: { $ne: 'cancelled' } // Don't count cancelled appointments
        });

        if (existingAppointments >= 4) {
            return NextResponse.json({ message: 'Slot is full (Max 4 patients)' }, { status: 400 });
        }

        const newAppointment = new Appointment({
            patient: session.user.id,
            doctor: doctorId,
            date,
            reason,
            status: 'pending',
        });

        await newAppointment.save();

        return NextResponse.json(newAppointment, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    let query = {};
    if (session.user.role === 'patient') {
        query = { patient: session.user.id };
    } else if (session.user.role === 'doctor') {
        query = { doctor: session.user.id };
    }
    // Admin sees all

    try {
        const appointments = await Appointment.find(query)
            .populate('patient', 'name email')
            .populate('doctor', 'name specialization');
        return NextResponse.json(appointments);
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
