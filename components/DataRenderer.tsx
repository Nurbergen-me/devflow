import React from "react";
import { DEFAULT_EMPTY, DEFAULT_ERROR } from "@/constants/states";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props<T> {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data?: T[] | null | undefined;
  empty?: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
  render: (data: T[]) => React.ReactNode;
}

interface StateSceletonProps {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text: string;
    href: string;
  };
}

const StateSceleton = ({ image, title, message, button }: StateSceletonProps) => (
  <div className="mt-16 flex w-full flex-col items-center justify-center sm:mt-36">
    <>
      <Image
        src={image.dark}
        alt={image.alt}
        width={270}
        height={200}
        className="hidden object-cover dark:block"
      />
      <Image
        src={image.light}
        alt={image.alt}
        width={270}
        height={200}
        className="block object-cover dark:hidden"
      />
      <h2 className="h2-bold text-dark200_light900 mt-8 text-center">{title}</h2>
      <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">{message}</p>
      {button && (
        <Link href={button.href}>
          <Button className="paragraph-medium bg-primary-500 text-light-900 hover:bg-primary-500 mt-5 min-h-[46px] rounded-lg px-4 py-3">
            {button.text}
          </Button>
        </Link>
      )}
    </>
  </div>
);

const DataRenderer = <T,>({ success, error, data, empty = DEFAULT_EMPTY, render }: Props<T>) => {
  if (!success) {
    return (
      <StateSceleton
        image={{
          dark: "/images/dark-error.svg",
          light: "/images/light-error.svg",
          alt: "Error",
        }}
        title={error?.message || DEFAULT_ERROR.message}
        message={error?.details ? JSON.stringify(error.details, null, 2) : DEFAULT_ERROR.message}
        button={empty.button}
      />
    );
  }
  if (!data || data.length === 0) {
    return (
      <StateSceleton
        image={{
          dark: "/images/dark-illustration.png",
          light: "/images/light-illustration.png",
          alt: "Error",
        }}
        title={empty.title}
        message={empty.message}
        button={empty.button}
      />
    );
  }

  return <>{render(data)}</>;
};
export default DataRenderer;
