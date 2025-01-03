import { getServerSession } from "next-auth";
import Form from "./Form";
import { redirect } from "next/navigation";
import UploadUsers from "./UploadUsers";
import Tabs from "./Register";


export default async function Login() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="">
      <Tabs />
    </div>
  );
}
