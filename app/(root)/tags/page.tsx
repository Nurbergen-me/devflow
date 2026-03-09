import CommonFilter from "@/components/filters/CommonFilter";
import { TagFilters } from "@/constants/filters";
import React from "react";
import { getTags } from "@/lib/actions/tag.action";
import { RouteParams } from "@/types/global";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { EMPTY_TAGS } from "@/constants/states";
import TagCard from "@/components/cards/TagCard";

const Tags = async ({ searchParams }: RouteParams) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const tags = data?.tags;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text3">Tags</h1>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          otherClasses="flex-1"
          route={ROUTES.TAGS}
        />
        <CommonFilter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </section>
      <DataRenderer
        success={success}
        data={tags}
        error={error}
        empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-10 flex w-full flex-wrap gap-4">
            {tags.map((tag) => (
              <TagCard
                key={tag._id}
                {...tag}
              />
            ))}
          </div>
        )}
      />
    </>
  );
};
export default Tags;
