// src/app/api/profile/updatePicture/route.js
import { connectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";
import { NextResponse } from "next/server";
import { storage } from "@/configs/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

connectDB();

export async function POST(req) {
    try {
        const formData = await req.formData();
        const userId = formData.get("userId");
        const profilePicture = formData.get("profilePicture");

        if (!userId || !profilePicture) {
            return NextResponse.json({ message: "Missing userId or profilePicture" }, { status: 400 });
        }

        const user = await userModel.findOne({ regNumber: userId });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const storageRef = ref(storage, `profilePictures/${userId}`);
        try {
            await uploadBytes(storageRef, profilePicture);
            const profilePictureUrl = await getDownloadURL(storageRef);

            user.profilePicture = profilePictureUrl;
            await user.save();

            return NextResponse.json({ message: "Profile picture updated successfully" }, { status: 200 });
        } catch (uploadError) {
            console.error("Error uploading file to Firebase Storage:", uploadError.code, uploadError.customData, uploadError.serverResponse);
            return NextResponse.json({ message: "Error uploading file to Firebase Storage", error: uploadError.message }, { status: 500 });
        }

    } catch (error) {
        console.error("Error updating profile picture:", error);
        return NextResponse.json({ message: "Error updating profile picture", error: error.message }, { status: 500 });
    }
}
