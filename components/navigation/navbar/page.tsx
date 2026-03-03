import Link from "next/link";
import Image from "next/image";
import { Theme } from "@/components/navigation/navbar/Theme";
import MobileNavigation from "@/components/navigation/navbar/MobileNavigation";
import { auth } from "@/auth";
import UserAvatar from "@/components/UserAvatar";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex-between background-light900_dark200 shadow-light-300 fixed z-50 w-full gap-5 p-5.5 px-7.5 dark:shadow-none">
      <Link
        href="/"
        className="flex-center gap-1"
      >
        <Image
          src="/images/site-logo.svg"
          alt="DevOverflow"
          width={23}
          height={23}
        />
        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev<span className="text-primary-500">Overflow</span>
        </p>
      </Link>
      <p className="background-light800_dark200 h-14 rounded-lg p-4">Search</p>
      <div className="flex-between gap-5">
        <Theme />
        {session?.user?.image && (
          <UserAvatar
            id={session.user.id!}
            name={session.user.name!}
            imageUrl={session.user.image}
          />
        )}
        <MobileNavigation />
      </div>
    </nav>
  );
};
export default Navbar;
