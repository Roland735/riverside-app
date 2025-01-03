import { connectDB } from '@/configs/dbConfig';
import Department from '@/models/Departments';


export async function GET(req, { params }) {
    try {
        await connectDB();
        const department = await Department.findById(params.id).populate('subjects').populate('staffMembers');
        if (!department) {
            return new NextResponse(JSON.stringify({ error: 'Department not found' }), { status: 404 });
        }
        return new NextResponse(JSON.stringify(department), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { name, subjects, staffMembers } = await req.json();
        const updatedDepartment = await Department.findByIdAndUpdate(params.id, { name, subjects, staffMembers }, { new: true });
        if (!updatedDepartment) {
            return new NextResponse(JSON.stringify({ error: 'Department not found' }), { status: 404 });
        }
        return new NextResponse(JSON.stringify(updatedDepartment), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const deletedDepartment = await Department.findByIdAndDelete(params.id);
        if (!deletedDepartment) {
            return new NextResponse(JSON.stringify({ error: 'Department not found' }), { status: 404 });
        }
        return new NextResponse(JSON.stringify({ message: 'Department deleted successfully' }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
