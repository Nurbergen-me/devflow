import { auth } from "@/auth";
import { getSavedQuestions } from "@/lib/actions/collection.action";
import ROUTES from "@/constants/routes";
import LocalSearch from "@/components/search/LocalSearch";
import HomeFilters from "@/components/filters/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import { EMPTY_COLLECTIONS } from "@/constants/states";
import { redirect } from "next/navigation";

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

const CollectionPage = async ({ searchParams }: SearchParams) => {
  const { page, pageSize, query = "", filter = "" } = await searchParams;
  const { success, data, error } = await getSavedQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
    filter: filter || "",
  });

  const loggedInUser = await auth();

  if (!loggedInUser) return redirect(ROUTES.SIGN_IN);

  const collection = data?.collection || [];

  return (
    <>
      <h1 className="h1-bold">Saved Questions</h1>

      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
          route={ROUTES.COLLECTION}
        />
      </section>
      <HomeFilters />
      <div className="mt-10 flex w-full flex-col gap-6">
        <DataRenderer
          success={success}
          error={error}
          data={collection}
          empty={EMPTY_COLLECTIONS}
          render={(collection) =>
            collection.map((question) => (
              <QuestionCard
                key={question._id}
                question={question.question}
              />
            ))
          }
        />
      </div>
    </>
  );
};

export default CollectionPage;
