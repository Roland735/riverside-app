import { connectDB } from "@/configs/dbConfig";
import Exam from "@/models/examModel";
import { NextResponse } from "next/server";

connectDB();

export const GET = async (req) => {
    try {
        // Query to fetch all exam data
        const examData = await Exam.find({});

        // Prepare the response data in the required format
        const mockData = examData.map((examClass) => {
            const yearData = examClass.years.map((yearInfo) => {
                return {
                    year: yearInfo.year,
                    periods: yearInfo.termDays.map((term) => {
                        let periodSlug = term.examPeriod
                            .toLowerCase()
                            .replace(/ /g, '-')
                            .replace(/-term/, `-${yearInfo.year}`);
                        return {
                            name: term.examPeriod,
                            date: `${yearInfo.year}`, // Adjust date format based on actual data
                            slug: periodSlug
                        };
                    }),
                };
            });
            return yearData;
        });

        const formattedData = mockData.flat().filter((item, index, self) =>
            index === self.findIndex((t) => (
                t.periods[0].slug === item.periods[0].slug
            ))
        );
        console.log("Formatted data:", formattedData);


        // Return the formatted data
        return NextResponse.json({ data: formattedData }, { status: 200 });
    } catch (error) {
        console.error("Error fetching exam data:", error);
        return NextResponse.json({ message: "Error fetching exam data", error: error.message }, { status: 500 });
    }
};
