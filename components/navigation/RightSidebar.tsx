import DataRenderer from "@/components/DataRenderer";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";
import React from "react";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import TagCard from "@/components/cards/TagCard";

const RightSidebar = async () => {
  const { success, data: hotQuestions, error } = await getHotQuestions();
  const { success: tagSuccess, data: tags, error: tagError } = await getTopTags();
  return (
    <section className="custom-scrollbar background-light900_dark200 shadow-light-300 light-border sticky top-0 right-0 flex h-screen w-87.5 flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-xl:hidden max-sm:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light800">Top questions</h3>
        <div className="mt-7 flex w-full flex-col gap-7.5">
          <DataRenderer
            data={hotQuestions}
            empty={{
              title: "No questions found",
              message: "No questions have been asked yet.",
            }}
            success={success}
            error={error}
            render={(hotQuestions) => (
              <div className="mt-7 flex w-full flex-col gap-7.5">
                {hotQuestions.map(({ _id, title }, index) => (
                  <Link
                    key={_id}
                    href={ROUTES.QUESTION(_id)}
                    className="flex cursor-pointer items-center gap-3"
                  >
                    <Image
                      src={
                        index % 2 ? `/icons/question-secondary.svg` : `/icons/question-active.svg`
                      }
                      alt="Question"
                      width={20}
                      height={20}
                    />
                    <p className="body-medium text-dark500_light700 line-clamp-2">{title}</p>
                  </Link>
                ))}
              </div>
            )}
          />
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular tags</h3>
        <DataRenderer
          data={tags}
          empty={{
            title: "No tags found",
            message: "No tags have been created yet.",
          }}
          success={tagSuccess}
          error={tagError}
          render={(tags) => (
            <div className="mt-7 flex flex-col gap-4">
              {tags.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};
export default RightSidebar;
