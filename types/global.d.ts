import { NextResponse } from "next/server";

interface ITag {
  _id: string;
  name: string;
}

interface IAuthor {
  _id: string;
  name: string;
  image: string;
}

interface IQuestion {
  _id: string;
  title: string;
  content: string;
  tags: ITag[];
  author: IAuthor;
  createdAt: Date;
  views: number;
  answers: number;
  upvotes: number;
  downvotes: number;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface GetTagQuesionsParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}

interface IAnswer {
  _id: string;
  content: string;
  author: IAuthor;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

interface GetAnswersParams extends PaginatedSearchParams {
  questionId: string;
}
