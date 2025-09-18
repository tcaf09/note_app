import NoteCard from "@/components/NoteCard";
import { useEffect, useState } from "react";

type User = {
  username: string;
  password: string;
  email: string;
}

function Dashboard() {
  const authToken = localStorage.getItem("token");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
          },
        });

        if (!res.ok) throw new Error("Failed to get user data");

        const data = await res.json();
        setUser(data)
      } catch (err) {
        console.log(err);
      }
    }

    getUser();
  }, [authToken]);

  return (
    <div className="w-full h-full">
      <h1 className="text-white mx-auto my-20 text-center text-6xl">
        Welcome, {user && user.username}
      </h1>
      <div className="w-2/3 p-10 mx-auto rounded-3xl bg-black">
        <NoteCard /> 
      </div>
    </div>
  );
}

export default Dashboard;
