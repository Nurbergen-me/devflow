import React from "react";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import Image from "next/image";
import TagCards from "@/components/cards/TagCards";

const hotQuestions = [
  { _id: "1", title: "How to use React Hooks?" },
  { _id: "2", title: "How to use Next.js?" },
  { _id: "3", title: "How to use Tailwind CSS?" },
  { _id: "4", title: "How to use React Query?" },
];

const popularTags = [
  { _id: "1", name: "js", questions: 100 },
  { _id: "2", name: "next.js", questions: 150 },
  { _id: "3", name: "tailwind-css", questions: 75 },
  { _id: "4", name: "react-routes", questions: 120 },
];

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 shadow-light-300 light-border sticky top-0 right-0 flex h-screen w-87.5 flex-col gap-6 overflow-y-auto border-l p-6 pt-36 max-xl:hidden max-sm:hidden dark:shadow-none">
      <div>
        <h3 className="h3-bold text-dark200_light800">Top questions</h3>
        <div className="mt-7 flex w-full flex-col gap-7.5">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              href={ROUTES.PROFILE(_id)}
              key={_id}
              className="flex cursor-pointer items-center justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">{title}</p>
              <Image
                src="/icons/chevron-right.svg"
                alt="Chevron"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {popularTags.map(({ _id, name, questions }) => (
            <TagCards
              key={_id}
              _id={_id}
              name={name}
              questions={questions}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default RightSidebar;
