import { connectDB } from "@/configs/dbConfig";
import { SchoolClass } from "@/models/GradeSyllabus";
import { NextResponse } from "next/server";
import { storage } from "@/configs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

connectDB();

export async function POST(req) {
    try {
        const formData = await req.formData();
        const subject = formData.get('subject');
        const topic = formData.get('topic');
        const resource = formData.get('resource');

        if (!subject || !resource) {
            return NextResponse.json({ message: "Missing subject or resource" }, { status: 400 });
        }

        const storageRef = ref(storage, `resources/${subject}/${resource.name}`);
        console.log(storageRef);

        await uploadBytes(storageRef, resource);
        const resourceUrl = await getDownloadURL(storageRef);

        const updateQuery = { "years.year": 2025, "years.subjects.name": subject };

        let updateDocument, arrayFilters;

        if (topic) {
            updateDocument = {
                $push: {
                    "years.$[year].subjects.$[subject].topicsTaught.$[topic].resources": {
                        name: resource.name,
                        link: resourceUrl
                    }
                }
            };
            arrayFilters = [
                { "year.year": 2025 },
                { "subject.name": subject },
                { "topic.title": topic }
            ];
        } else {
            updateDocument = {
                $push: {
                    "years.$[year].subjects.$[subject].resources": {
                        name: resource.name,
                        link: resourceUrl
                    }
                }
            };
            arrayFilters = [
                { "year.year": 2025 },
                { "subject.name": subject }
            ];
        }

        await SchoolClass.updateOne(updateQuery, updateDocument, { arrayFilters });

        return NextResponse.json({ message: "Resource uploaded successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error uploading resource:", error);
        return NextResponse.json({ message: "Error uploading resource", error: error.message }, { status: 500 });
    }
}
