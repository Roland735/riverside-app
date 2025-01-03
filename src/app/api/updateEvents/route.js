import { connectDB } from '@/configs/dbConfig';
import CalendarEvent from '@/models/CalendarEvent';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        await connectDB();
        const events = await CalendarEvent.find();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching events' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await connectDB();
        console.log("hi");

        const data = await request.json();
        console.log("hi");

        const event = new CalendarEvent(data);
        console.log("hi");
        await event.save();
        console.log("hi");
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Error creating event' }, { status: 500 });
    }
}
