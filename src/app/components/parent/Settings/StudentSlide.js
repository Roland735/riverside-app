import React from 'react';

const StudentSlide = ({ student, onMarkChange }) => {
    const [image, setImage] = useState(student?.image || null); // State for image preview (use default if no image)
    const [name, setName] = useState(student?.name || ''); // State for name (use default if no name)
    const [surname, setSurname] = useState(student?.surname || ''); // State for surname (use default if no surname)
    const [regNumber, setRegNumber] = useState(student?.regNumber || ''); // State for regNumber (use default if no regNumber)
    const [classValue, setClassValue] = useState(student?.class || ''); // State for class (use default if no class)

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => setImage(e.target.result);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'surname':
                setSurname(value);
                break;
            case 'regNumber':
                setRegNumber(value);
                break;
            case 'class':
                setClassValue(value);
                break;
            default:
                break;
        }
    };

    return (
        <div className="student-slide">
            <div className="student-image-container">
                {image && <img src={image} alt="Student" />}
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div className="student-info">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                />
                <label htmlFor="surname">Surname:</label>
                <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={surname}
                    onChange={handleChange}
                />
                <label htmlFor="regNumber">Registration Number:</label>
                <input
                    type="text"
                    id="regNumber"
                    name="regNumber"
                    value={regNumber}
                    onChange={handleChange}
                />
                <label htmlFor="class">Class:</label>
                <input
                    type="text"
                    id="class"
                    name="class"
                    value={classValue}
                    onChange={handleChange}
                />
                <label htmlFor="mark">Mark:</label>
                <input
                    type="number"
                    id="mark"
                    name="mark"
                    onChange={(event) => onMarkChange(event.target.value)}
                />
            </div>
        </div>
    );
};

export default StudentSlide;
