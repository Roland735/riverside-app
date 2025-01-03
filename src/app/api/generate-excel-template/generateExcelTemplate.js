import { SchoolClass } from "@/models/GradeSyllabus";
import excel from 'excel4node';

const generateExcelTemplate = async (className, subjectName, templateType) => {
    // Find the class based on className
    const schoolClass = await SchoolClass.findOne({ className });

    // If the class is not found, return null
    if (!schoolClass) {
        return null;
    }

    // Create a new Excel workbook
    const workbook = new excel.Workbook();

    // Add a worksheet to the workbook
    const worksheet = workbook.addWorksheet('Students');

    // Define the headers based on the template type
    let headers, formulaColumn;
    switch (templateType) {
        case 'test':
            headers = ['name', 'lastname', 'regNumber', 'mark', 'total', 'testMark', 'absent'];
            formulaColumn = 'F';
            break;
        case 'assignment':
            headers = ['name', 'lastname', 'regNumber', 'mark', 'total', 'assignmentMark', 'absent'];
            formulaColumn = 'F';
            break;
        case 'quiz':
            headers = ['name', 'lastname', 'regNumber', 'mark', 'total', 'quizMark', 'absent'];
            formulaColumn = 'F';
            break;
        default:
            throw new Error('Invalid template type');
    }

    // Add headers to the worksheet
    headers.forEach((header, index) => {
        worksheet.cell(1, index + 1).string(header);
    });

    // Sort students by last name
    const sortedStudents = schoolClass.years.reduce((acc, year) => {
        year.students.forEach((student) => {
            acc.push(student);
        });
        return acc;
    }, []).sort((a, b) => {
        const lastNameA = a.name.split(' ')[1].toLowerCase();
        const lastNameB = b.name.split(' ')[1].toLowerCase();
        if (lastNameA < lastNameB) return -1;
        if (lastNameA > lastNameB) return 1;
        return 0;
    });

    // Add student data to the worksheet
    let row = 2;
    sortedStudents.forEach((student) => {
        const firstName = student.name.split(' ')[0];
        const lastName = student.name.split(' ')[1];
        worksheet.cell(row, 1).string(firstName);
        worksheet.cell(row, 2).string(lastName);
        worksheet.cell(row, 3).string(student.reg_number);
        worksheet.cell(row, 4).number(0);  // Placeholder for Mark
        worksheet.cell(row, 5).number(0);  // Placeholder for Total
        worksheet.cell(row, 6).formula(`(D${row}/E${row})*100`);  // Formula for (Mark/Total)*100
        worksheet.cell(row, 7).bool(false);  // Placeholder for Absent
        row++;
    });

    // Write the workbook to a buffer
    const excelBuffer = await workbook.writeToBuffer();

    return excelBuffer;
};

export default generateExcelTemplate;
