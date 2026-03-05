import React from "react";
import { getTags } from "@/lib/actions/tag.action";

const Tags = async () => {
  const { success, data, error } = await getTags({
    page: 1,
    pageSize: 10,
    query: "",
    sort: "",
  });

  const tags = data?.tags;
  console.log(tags);

  return <div>Tags</div>;
};
export default Tags;
