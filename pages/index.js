import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  return (
    <Layout>
      <h1>Single Point of Access</h1>
      <div className="text-blue-900 flex justify-between">
        <h1>
          Hello , <b>{session?.user?.name}</b>
        </h1>
        <div className="flex bg-gray-200 gap-1 text-black p-2 rounded overflow-hidden">
          <img src={session?.user?.image} className="w-8 h-8 rounded-[50%]" />
          <span className="py-1 px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
