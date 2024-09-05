"use client"

import { Button } from "@/components/ui/button";
import { Role } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";

const Home = () => {
  const {update} = useSession()

  const handleUpdate = () => {
    update({
      role: Role.Marketer
    })
  }

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div>
      <Button onClick={handleUpdate}>Hello</Button>
      <Button onClick={handleSignOut}>Sign out</Button>
    </div>
  )
}

export default Home;