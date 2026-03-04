import React from "react";
import { RouteParams } from "@/types/global";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;
  return <div>Page {id}</div>;
};
export default Page;
