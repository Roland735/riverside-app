// /pages/api/updateEvents/[id].js

import { NextResponse } from 'next/server';
import { connectDB } from '@/configs/dbConfig';
import CalendarEvent from '@/models/CalendarEvent';

export async function GET({ params }) {
    try {
        await connectDB();
        const event = await CalendarEvent.findById(params.id);
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching event' }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const data = await request.json();
        const event = await CalendarEvent.findByIdAndUpdate(params.id, data, { new: true });
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating event' }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        console.log('DELETE request received');

        const { id } = params;
        const result = await CalendarEvent.findByIdAndDelete(id);

        console.log('Delete result:', result);

        if (!result) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Error deleting event' }, { status: 500 });
    }
}
