// pages/api/events/route.js

import { connectDB } from '@/configs/dbConfig'; // Update the path according to your actual configuration
import CalendarEvent from '@/models/CalendarEvent';
import { NextResponse } from 'next/server';

// Connect to the database
connectDB();

export async function GET() {
    try {
        // Fetch events from the database
        const events = await CalendarEvent.find().sort({ startDate: 1 }); // Sort by start date

        // Send a JSON response with the events
        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
