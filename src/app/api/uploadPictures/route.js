import { connectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";
import { storage } from "@/configs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

connectDB();

export async function POST(req) {
    try {
        const formData = await req.formData();

        const pictureEntries = [];
        formData.forEach((value, key) => {
            const match = key.match(/^(picture|userId)_(\d+)$/);
            if (match) {
                const [, type, index] = match;
                if (!pictureEntries[index]) pictureEntries[index] = {};
                pictureEntries[index][type] = value;
            }
        });

        for (const entry of pictureEntries) {
            const { picture, userId } = entry;

            if (!userId || !picture) {
                return NextResponse.json({ message: "Missing userId or picture" }, { status: 400 });
            }

            const user = await userModel.findOne({ regNumber: userId });
            if (!user) {
                return NextResponse.json({ message: `User not found for regNumber ${userId}` }, { status: 404 });
            }

            const storageRef = ref(storage, `profilePictures/${userId}`);
            try {
                await uploadBytes(storageRef, picture);
                const pictureUrl = await getDownloadURL(storageRef);

                user.profilePicture = pictureUrl;
                await user.save();
            } catch (uploadError) {
                console.error("Error uploading file to Firebase Storage:", uploadError.code, uploadError.customData, uploadError.serverResponse);
                return NextResponse.json({ message: "Error uploading file to Firebase Storage", error: uploadError.message }, { status: 500 });
            }
        }

        return NextResponse.json({ message: "Pictures uploaded successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error uploading pictures:", error);
        return NextResponse.json({ message: "Error uploading pictures", error: error.message }, { status: 500 });
    }
}
