export const mockData = {
    2023: {
        grades: [
            { gradeName: 'grade 1', grade: 'A', numStudents: 30, avgMark: 85 },
            { gradeName: 'grade 2', grade: 'B+', numStudents: 28, avgMark: 82 },
            { gradeName: 'grade 3', grade: 'A-', numStudents: 32, avgMark: 84 },
            { gradeName: 'grade 4', grade: 'B', numStudents: 29, avgMark: 80 },
            { gradeName: 'grade 5', grade: 'A', numStudents: 31, avgMark: 88 },
            { gradeName: 'grade 6', grade: 'B+', numStudents: 27, avgMark: 83 },
            { gradeName: 'grade 7', grade: 'A-', numStudents: 26, avgMark: 86 },
        ],
        classes: [
            {
                gradeName: 'grade 1',
                classes: [
                    { class: 'Class A', mark: 78, cambridgeGrade: 'B', markChange: '+2', attendance: '85%', teachers: ['Mr. Smith', 'Ms. Johnson'] },
                    { class: 'Class B', mark: 88, cambridgeGrade: 'A', markChange: '-1', attendance: '92%', teachers: ['Mr. Brown', 'Mrs. Lee'] },
                    { class: 'Class C', mark: 82, cambridgeGrade: 'B+', markChange: '0', attendance: '87%', teachers: ['Dr. White', 'Ms. Taylor'] },
                ],
            },
            {
                gradeName: 'grade 2',
                classes: [
                    { class: 'Class A', mark: 76, cambridgeGrade: 'B', markChange: '0', attendance: '84%', teachers: ['Mr. Walker', 'Ms. Hall'] },
                    { class: 'Class B', mark: 81, cambridgeGrade: 'B+', markChange: '+3', attendance: '89%', teachers: ['Mr. Green', 'Mrs. Adams'] },
                    { class: 'Class C', mark: 79, cambridgeGrade: 'B', markChange: '-2', attendance: '86%', teachers: ['Dr. Brown', 'Ms. Harris'] },
                ],
            },
            {
                gradeName: 'grade 3',
                classes: [
                    { class: 'Class A', mark: 85, cambridgeGrade: 'A-', markChange: '+1', attendance: '90%', teachers: ['Mr. Thompson', 'Ms. Robinson'] },
                    { class: 'Class B', mark: 84, cambridgeGrade: 'B+', markChange: '0', attendance: '88%', teachers: ['Mr. White', 'Mrs. Clark'] },
                    { class: 'Class C', mark: 83, cambridgeGrade: 'B+', markChange: '-1', attendance: '87%', teachers: ['Dr. Martinez', 'Ms. Lewis'] },
                ],
            },
            {
                gradeName: 'grade 4',
                classes: [
                    { class: 'Class A', mark: 80, cambridgeGrade: 'B', markChange: '+1', attendance: '85%', teachers: ['Mr. Lee', 'Ms. Walker'] },
                    { class: 'Class B', mark: 78, cambridgeGrade: 'B-', markChange: '-1', attendance: '83%', teachers: ['Mr. Harris', 'Mrs. Young'] },
                    { class: 'Class C', mark: 81, cambridgeGrade: 'B+', markChange: '+2', attendance: '87%', teachers: ['Dr. Allen', 'Ms. King'] },
                ],
            },
            {
                gradeName: 'grade 5',
                classes: [
                    { class: 'Class A', mark: 88, cambridgeGrade: 'A-', markChange: '+3', attendance: '92%', teachers: ['Mr. Scott', 'Ms. Lopez'] },
                    { class: 'Class B', mark: 87, cambridgeGrade: 'A-', markChange: '0', attendance: '91%', teachers: ['Mr. Green', 'Mrs. Hill'] },
                    { class: 'Class C', mark: 89, cambridgeGrade: 'A', markChange: '+1', attendance: '93%', teachers: ['Dr. Adams', 'Ms. Baker'] },
                ],
            },
            {
                gradeName: 'grade 6',
                classes: [
                    { class: 'Class A', mark: 83, cambridgeGrade: 'B+', markChange: '0', attendance: '88%', teachers: ['Mr. Carter', 'Ms. Mitchell'] },
                    { class: 'Class B', mark: 82, cambridgeGrade: 'B', markChange: '-1', attendance: '87%', teachers: ['Mr. Parker', 'Mrs. Roberts'] },
                    { class: 'Class C', mark: 84, cambridgeGrade: 'B+', markChange: '+2', attendance: '89%', teachers: ['Dr. Evans', 'Ms. Phillips'] },
                ],
            },
            {
                gradeName: 'grade 7',
                classes: [
                    { class: 'Class A', mark: 86, cambridgeGrade: 'A-', markChange: '+2', attendance: '90%', teachers: ['Mr. Turner', 'Ms. Campbell'] },
                    { class: 'Class B', mark: 85, cambridgeGrade: 'B+', markChange: '0', attendance: '89%', teachers: ['Mr. Ward', 'Mrs. Rogers'] },
                    { class: 'Class C', mark: 87, cambridgeGrade: 'A-', markChange: '+1', attendance: '91%', teachers: ['Dr. Stewart', 'Ms. Torres'] },
                ],
            },
        ],
    },
    2022: {
        grades: [
            { gradeName: 'grade 1', grade: 'B+', numStudents: 30, avgMark: 80 },
            { gradeName: 'grade 2', grade: 'A', numStudents: 28, avgMark: 85 },
            { gradeName: 'grade 3', grade: 'B-', numStudents: 32, avgMark: 78 },
            { gradeName: 'grade 4', grade: 'B+', numStudents: 29, avgMark: 82 },
            { gradeName: 'grade 5', grade: 'A-', numStudents: 31, avgMark: 87 },
            { gradeName: 'grade 6', grade: 'B', numStudents: 27, avgMark: 79 },
            { gradeName: 'grade 7', grade: 'A', numStudents: 26, avgMark: 90 },
        ],
        classes: [
            {
                gradeName: 'grade 1',
                classes: [
                    { class: 'Class A', mark: 75, cambridgeGrade: 'C', markChange: '-3', attendance: '80%', teachers: ['Mr. Davis', 'Ms. Wilson'] },
                    { class: 'Class B', mark: 85, cambridgeGrade: 'B+', markChange: '+2', attendance: '88%', teachers: ['Mr. Evans', 'Mrs. Martinez'] },
                    { class: 'Class C', mark: 77, cambridgeGrade: 'C+', markChange: '0', attendance: '82%', teachers: ['Dr. Garcia', 'Ms. Allen'] },
                ],
            },
            {
                gradeName: 'grade 2',
                classes: [
                    { class: 'Class A', mark: 90, cambridgeGrade: 'A', markChange: '+3', attendance: '95%', teachers: ['Mr. Young', 'Ms. Hernandez'] },
                    { class: 'Class B', mark: 88, cambridgeGrade: 'A-', markChange: '0', attendance: '92%', teachers: ['Mr. King', 'Mrs. Wright'] },
                    { class: 'Class C', mark: 84, cambridgeGrade: 'B+', markChange: '-1', attendance: '90%', teachers: ['Dr. Scott', 'Ms. Green'] },
                ],
            },
            {
                gradeName: 'grade 3',
                classes: [
                    { class: 'Class A', mark: 72, cambridgeGrade: 'C+', markChange: '-2', attendance: '78%', teachers: ['Mr. Baker', 'Ms. Adams'] },
                    { class: 'Class B', mark: 75, cambridgeGrade: 'B-', markChange: '+1', attendance: '80%', teachers: ['Mr. Gonzalez', 'Mrs. Nelson'] },
                    { class: 'Class C', mark: 77, cambridgeGrade: 'B', markChange: '0', attendance: '82%', teachers: ['Dr. Carter', 'Ms. Hill'] },
                ],
            },
            {
                gradeName: 'grade 4',
                classes: [
                    { class: 'Class A', mark: 82, cambridgeGrade: 'B+', markChange: '+2', attendance: '87%', teachers: ['Mr. Roberts', 'Ms. Mitchell'] },
                    { class: 'Class B', mark: 80, cambridgeGrade: 'B', markChange: '-1', attendance: '85%', teachers: ['Mr. Perez', 'Mrs. Carter'] },
                    { class: 'Class C', mark: 79, cambridgeGrade: 'B-', markChange: '0', attendance: '83%', teachers: ['Dr. Collins', 'Ms. Morgan'] },
                ],
            },
            {
                gradeName: 'grade 5',
                classes: [
                    { class: 'Class A', mark: 85, cambridgeGrade: 'A-', markChange: '0', attendance: '90%', teachers: ['Mr. Reed', 'Ms. Bell'] },
                    { class: 'Class B', mark: 83, cambridgeGrade: 'B+', markChange: '-1', attendance: '89%', teachers: ['Mr. Cook', 'Mrs. Murphy'] },
                    { class: 'Class C', mark: 86, cambridgeGrade: 'A-', markChange: '+2', attendance: '92%', teachers: ['Dr. Watson', 'Ms. Bailey'] },
                ],
            },
            {
                gradeName: 'grade 6',
                classes: [
                    { class: 'Class A', mark: 78, cambridgeGrade: 'B', markChange: '-2', attendance: '82%', teachers: ['Mr. Rivera', 'Ms. Kim'] },
                    { class: 'Class B', mark: 81, cambridgeGrade: 'B+', markChange: '0', attendance: '85%', teachers: ['Mr. Howard', 'Mrs. Ward'] },
                    { class: 'Class C', mark: 83, cambridgeGrade: 'B+', markChange: '+2', attendance: '88%', teachers: ['Dr. Cox', 'Ms. Richardson'] },
                ],
            },
            {
                gradeName: 'grade 7',
                classes: [
                    { class: 'Class A', mark: 90, cambridgeGrade: 'A', markChange: '+3', attendance: '94%', teachers: ['Mr. Brooks', 'Ms. Bennett'] },
                    { class: 'Class B', mark: 88, cambridgeGrade: 'A-', markChange: '0', attendance: '92%', teachers: ['Mr. Barnes', 'Mrs. Powell'] },
                    { class: 'Class C', mark: 87, cambridgeGrade: 'A-', markChange: '-1', attendance: '91%', teachers: ['Dr. Flores', 'Ms. Bryant'] },
                ],
            },
        ],
    },
    2021: {
        grades: [
            { gradeName: 'grade 1', grade: 'B', numStudents: 30, avgMark: 78 },
            { gradeName: 'grade 2', grade: 'A-', numStudents: 28, avgMark: 83 },
            { gradeName: 'grade 3', grade: 'B+', numStudents: 32, avgMark: 80 },
            { gradeName: 'grade 4', grade: 'B-', numStudents: 29, avgMark: 76 },
            { gradeName: 'grade 5', grade: 'A-', numStudents: 31, avgMark: 85 },
            { gradeName: 'grade 6', grade: 'B+', numStudents: 27, avgMark: 79 },
            { gradeName: 'grade 7', grade: 'A', numStudents: 26, avgMark: 87 },
        ],
        classes: [
            {
                gradeName: 'grade 1',
                classes: [
                    { class: 'Class A', mark: 72, cambridgeGrade: 'C+', markChange: '0', attendance: '78%', teachers: ['Mr. King', 'Ms. Scott'] },
                    { class: 'Class B', mark: 82, cambridgeGrade: 'B', markChange: '+2', attendance: '85%', teachers: ['Mr. Hughes', 'Mrs. Garcia'] },
                    { class: 'Class C', mark: 74, cambridgeGrade: 'C', markChange: '-1', attendance: '80%', teachers: ['Dr. White', 'Ms. Taylor'] },
                ],
            },
            {
                gradeName: 'grade 2',
                classes: [
                    { class: 'Class A', mark: 78, cambridgeGrade: 'B', markChange: '0', attendance: '82%', teachers: ['Mr. Ramirez', 'Ms. Turner'] },
                    { class: 'Class B', mark: 80, cambridgeGrade: 'B+', markChange: '+1', attendance: '84%', teachers: ['Mr. Torres', 'Mrs. Perry'] },
                    { class: 'Class C', mark: 83, cambridgeGrade: 'B+', markChange: '+2', attendance: '88%', teachers: ['Dr. Patterson', 'Ms. Cox'] },
                ],
            },
            {
                gradeName: 'grade 3',
                classes: [
                    { class: 'Class A', mark: 79, cambridgeGrade: 'B', markChange: '-1', attendance: '81%', teachers: ['Mr. Long', 'Ms. Gray'] },
                    { class: 'Class B', mark: 77, cambridgeGrade: 'B-', markChange: '-2', attendance: '79%', teachers: ['Mr. Hughes', 'Mrs. Flores'] },
                    { class: 'Class C', mark: 82, cambridgeGrade: 'B+', markChange: '0', attendance: '83%', teachers: ['Dr. Washington', 'Ms. Nguyen'] },
                ],
            },
            {
                gradeName: 'grade 4',
                classes: [
                    { class: 'Class A', mark: 75, cambridgeGrade: 'C+', markChange: '-3', attendance: '77%', teachers: ['Mr. Sanders', 'Ms. Price'] },
                    { class: 'Class B', mark: 78, cambridgeGrade: 'B-', markChange: '-1', attendance: '81%', teachers: ['Mr. Russell', 'Mrs. Diaz'] },
                    { class: 'Class C', mark: 80, cambridgeGrade: 'B', markChange: '+2', attendance: '84%', teachers: ['Dr. Ortiz', 'Ms. Hayes'] },
                ],
            },
            {
                gradeName: 'grade 5',
                classes: [
                    { class: 'Class A', mark: 83, cambridgeGrade: 'B+', markChange: '0', attendance: '87%', teachers: ['Mr. Griffin', 'Ms. Mitchell'] },
                    { class: 'Class B', mark: 85, cambridgeGrade: 'A-', markChange: '+1', attendance: '89%', teachers: ['Mr. Butler', 'Mrs. Simmons'] },
                    { class: 'Class C', mark: 87, cambridgeGrade: 'A-', markChange: '+2', attendance: '90%', teachers: ['Dr. Alexander', 'Ms. Rivera'] },
                ],
            },
            {
                gradeName: 'grade 6',
                classes: [
                    { class: 'Class A', mark: 79, cambridgeGrade: 'B', markChange: '-1', attendance: '82%', teachers: ['Mr. Lopez', 'Ms. Wallace'] },
                    { class: 'Class B', mark: 82, cambridgeGrade: 'B+', markChange: '0', attendance: '85%', teachers: ['Mr. Chavez', 'Mrs. Knight'] },
                    { class: 'Class C', mark: 81, cambridgeGrade: 'B', markChange: '+1', attendance: '83%', teachers: ['Dr. Baker', 'Ms. Wells'] },
                ],
            },
            {
                gradeName: 'grade 7',
                classes: [
                    { class: 'Class A', mark: 86, cambridgeGrade: 'A-', markChange: '+2', attendance: '90%', teachers: ['Mr. Turner', 'Ms. Campbell'] },
                    { class: 'Class B', mark: 85, cambridgeGrade: 'B+', markChange: '0', attendance: '89%', teachers: ['Mr. Ward', 'Mrs. Rogers'] },
                    { class: 'Class C', mark: 87, cambridgeGrade: 'A-', markChange: '+1', attendance: '91%', teachers: ['Dr. Stewart', 'Ms. Torres'] },
                ],
            },
        ],
    },
};
