import { useEffect, useState } from 'react';
import UploadProfilePictures from './MultipleProfile';

export default function UploadPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/users');
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    console.error("Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className='w-full '>
            <UploadProfilePictures users={users} />
        </div>
    );
}
