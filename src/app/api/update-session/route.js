// // API Route: /pages/api/update-session.js
// import { getSession } from "next-auth/react";

// export default async (req, res) => {
//     const session = await getSession({ req });
//     console.log("hi");


//     if (!session) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     // // Modify the session object or return the updated session data
//     // const updatedSession = {
//     //     ...session,
//     //     user: {
//     //         ...session.user,
//     //         profileUrl: req.body.profileUrl, // Add new information
//     //     },
//     // };

//     // If using a session store, update the store here
//     // You could also store this updated session server-side

//     res.status(200).json(updatedSession);
// };
