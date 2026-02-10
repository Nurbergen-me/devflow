import React from "react";
import Hello from "@/components/hello";

const Page = () => {
  console.log("server component");
  return (
    <>
      <h1 className="h1-bold">Hello</h1>
      <Hello />
    </>
  );
};
export default Page;
