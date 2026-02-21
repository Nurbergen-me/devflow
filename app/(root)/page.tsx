import React from "react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import ROUTES from "@/constants/routes";

const Home = async () => {
  const session = await auth();
  console.log(session);
  return (
    <>
      <h1>Welcome to the Home Page</h1>
    </>
  );
};
export default Home;
