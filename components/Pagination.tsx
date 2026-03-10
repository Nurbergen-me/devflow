"use client";

import { Button } from "@/components/ui/button";
import { formUrlQuery } from "@/lib/url";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  page: number | string | undefined;
  isNext: boolean;
  containerClasses?: string;
  pageKey?: string;
}

const Pagination = ({ page = 1, isNext, containerClasses, pageKey = "page" }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (type: "prev" | "next") => {
    const nextPageNumber = type === "prev" ? Number(page) - 1 : Number(page) + 1;
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: pageKey,
      value: nextPageNumber.toString(),
    });
    router.push(newUrl);
  };
  return (
    <div className={cn("mt-5 flex w-full items-center justify-center gap-2", containerClasses)}>
      {/* Prev Button*/}
      {Number(page) > 1 && (
        <Button
          onClick={() => handleNavigation("prev")}
          className="light-border-2 btn flex min-h-9 items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>
      )}

      <div className="bg-primary-500 flex items-center justify-center rounded-md px-3.5 py-2">
        <p className="body-semibold text-light-900">{page}</p>
      </div>

      {/* Next Button*/}
      {isNext && (
        <Button
          onClick={() => handleNavigation("next")}
          className="light-border-2 btn flex min-h-9 items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      )}
    </div>
  );
};
export default Pagination;
