import { NextResponse } from 'next/server';
import { connectDB } from "@/configs/dbConfig";
import Exam from '@/models/examModel';
import { userModel } from '@/models/userModel';


connectDB();

export async function POST(req) {


    try {
        const { classes } = await req.json();
        console.log('Received classes for confirmation:', classes);

        for (const classItem of classes) {
            const { _id, years } = classItem;
            const examClass = await Exam.findById(_id);
            const users = await userModel.find({ role: 'teacher' });
            let myInvigilators = []
            let myMarkers = []

            if (examClass) {
                let updated = false; // Track if there are any updates

                for (const year of years) {
                    console.log("hi");
                    console.log(year);




                    for (const subject of year.subjects) {
                        console.log(subject);
                        console.log("hi");

                        for (const exam of subject.exams) {
                            let allPapersConfirmed = true; // Track if all papers are confirmed
                            console.log("hi");
                            for (const paper of exam.papers) {

                                const existingPaper = examClass.years
                                    ?.find((yea) => yea.year === 2025)
                                    ?.subjects?.find((sub) => sub.name === subject.name)
                                    ?.exams?.find((ex) => ex.period === exam.period)
                                    ?.papers?.find((pa) => pa.paperNumber === paper.paperNumber);

                                console.log(existingPaper);
                                console.log(paper);
                                console.log("hi");
                                if (existingPaper) {
                                    console.log("hi");
                                    // Update paper confirmation status
                                    if (existingPaper.confirmed !== paper.confirmed) {
                                        existingPaper.confirmed = paper.confirmed;
                                        updated = true;
                                    }
                                    console.log(paper.invigilators);
                                    if (paper.invigilators.length > 0) {
                                        console.log("hi");

                                        paper.invigilators.map((invigilator) => {
                                            users.map((user) => {
                                                console.log(`${user.firstname} ${user.lastname}`);
                                                console.log(invigilator);


                                                if (`${user.firstname} ${user.lastname}` === invigilator.name) {
                                                    console.log("hi");
                                                    myInvigilators.push({
                                                        name: `${user.firstname} ${user.lastname}`,
                                                        regNumber: user.regNumber,
                                                    })
                                                    console.log(myInvigilators);

                                                }
                                            })
                                        });
                                        console.log(myInvigilators);

                                        paper.markers.map((marker) => {
                                            users.map((user) => {
                                                console.log(`${user.firstname} ${user.lastname}`);
                                                console.log(marker);
                                                if (`${user.firstname} ${user.lastname}` === marker.name) {
                                                    console.log("hi");
                                                    myMarkers.push({
                                                        name: `${user.firstname} ${user.lastname}`,
                                                        regNumber: user.regNumber,
                                                    })
                                                }
                                            });
                                        })
                                        console.log(myMarkers);


                                        console.log(myInvigilators);

                                    }




                                    console.log(myInvigilators);


                                    if (myInvigilators.length > 0) {
                                        existingPaper.invigilator = [];
                                        myInvigilators.map((invigilator) => {
                                            existingPaper.invigilator.push({
                                                name: invigilator.name,
                                                regNumber: invigilator.regNumber,
                                            });
                                        });

                                        updated = true;
                                    }
                                    console.log(existingPaper.invigilator);

                                    console.log(myMarkers);

                                    if (myMarkers.length > 0) {
                                        existingPaper.marker = [];
                                        myMarkers.map((marker) => {
                                            existingPaper.marker.push({
                                                name: marker.name,
                                                regNumber: marker.regNumber,
                                            });
                                        });

                                        updated = true;
                                        console.log(existingPaper.marker);

                                    }
                                    console.log(myMarkers);
                                    console.log(myInvigilators);

                                }

                                // Check if paper confirmation status is consistent
                                if (paper.confirmed === false) {
                                    allPapersConfirmed = false;
                                }
                                myInvigilators = []
                                myMarkers = []
                            }
                            console.log("exam Approved: ", exam.examApproved, "allPapersConfirmed: ", allPapersConfirmed, "exam.papers.length: ", exam.papers.length);
                            // Update examApproved status based on paper confirmations
                            if (exam.examApproved !== allPapersConfirmed && exam.papers.length > 0) {
                                console.log("examApproved: ", exam.examApproved, "allPapersConfirmed: ", allPapersConfirmed);

                                exam.examApproved = allPapersConfirmed;
                                console.log("examApproved: ", exam.examApproved, "allPapersConfirmed: ", allPapersConfirmed);

                                updated = true;
                            } else if (exam.papers.length === 0) {
                                exam.examApproved = false;
                                updated = true;
                            }
                        }
                        console.log("h");
                    }
                }

                if (updated) {
                    await examClass.save();
                    console.log(`Updated and saved examClass with ID ${_id}`);
                } else {
                    console.log(`No changes for examClass with ID ${_id}`);
                }
            } else {
                console.log(`Exam class with ID ${_id} not found`);
            }
        }

        return NextResponse.json({ message: 'Exams confirmed successfully' });
    } catch (error) {
        console.error('Error confirming exams:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
