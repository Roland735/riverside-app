import { connectDB } from '@/configs/dbConfig';
import Department from '@/models/Departments';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await connectDB();
        const departments = await Department.find().populate('subjects').populate('staffMembers');
        return new NextResponse(JSON.stringify(departments), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const { name, subjects, staffMembers } = await req.json();
        const newDepartment = new Department({ name, subjects, staffMembers });
        await newDepartment.save();
        return new NextResponse(JSON.stringify(newDepartment), { status: 201 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
