import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        regNumber: {}, // Add registration number
      },
      async authorize(credentials, req) {
        try {
          await connectDB();
          const existingUser = await userModel.findOne({
            email: credentials.email,
          });

          if (!existingUser) {
            return null;
          }

          const isMatch = await existingUser.matchPassword(credentials.password);
          if (!isMatch) {
            return null;
          }

          // If the role is 'parent', check if the student with the given regNumber exists
          let studentInfo = null;
          if (existingUser.role === "parent") {
            const student = existingUser.students.find(
              (student) => student.regNumber === credentials.regNumber
            );

            if (!student) {
              // If no student matches, return null
              return null;
            }

            // Add the matching student information
            studentInfo = {
              firstname: student.firstname,
              lastname: student.lastname,
              regNumber: student.regNumber,
              class: student.class,

            };
          }

          const user = {
            id: existingUser._id,
            firstname: existingUser.firstname,
            lastname: existingUser.lastname,
            email: existingUser.email,
            role: existingUser.role,
            regNumber: existingUser.regNumber,
            profileUrl: existingUser.profilePicture,
            active: existingUser.active,
            students: studentInfo ? [studentInfo] : [], // Only return the matched student
          };

          return user;
        } finally {
          await disconnectDB();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = user;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      session.user = token;
      return Promise.resolve(session);
    },
  },
});

export { handler as GET, handler as POST };
