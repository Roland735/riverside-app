import GuardiansDetails from './GuardiansDetails';
import MedicalDetails from './MedicalDetails';
import PreviousSchoolDetails from './PreviousSchoolDetails';
import AccordionSection from './AccordionSection';
import AddressDetails from './AddressDetails';

const StudentForm = ({ studentData, handleInputChange, handleSave }) => {
    console.log(studentData);

    return (
        <form>
            <AccordionSection title="Guardians Details">
                <GuardiansDetails studentData={studentData} handleInputChange={handleInputChange} handleSave={handleSave} />
            </AccordionSection>

            <AccordionSection title="Medical Details">
                <MedicalDetails studentData={studentData} handleInputChange={handleInputChange} handleSave={handleSave} />
            </AccordionSection>

            <AccordionSection title="Previous School Details">
                <PreviousSchoolDetails studentData={studentData} handleInputChange={handleInputChange} handleSave={handleSave} />
            </AccordionSection>

            <AccordionSection title="Address Details">
                <AddressDetails studentData={studentData} handleInputChange={handleInputChange} handleSave={handleSave} />
            </AccordionSection>



        </form>
    );
};

export default StudentForm;
