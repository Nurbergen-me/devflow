"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import ROUTES from "@/constants/routes";
import { signIn } from "next-auth/react";

const SocialAuthForm = () => {
  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: true,
      });
    } catch (error) {
      console.error(error);
      toast.error("Sign-in failed", {
        description: error instanceof Error ? error.message : "Error occurred during sing-in",
        position: "top-center",
      });
    }
  };
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <Button
        className="background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1"
        onClick={() => handleSignIn("github")}
      >
        <Image
          src="/icons/github.svg"
          alt="Github"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Login with Github</span>
      </Button>
      <Button
        className="background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1"
        onClick={() => handleSignIn("google")}
      >
        <Image src="/icons/google.svg" alt="Google" width={20} height={20} className="mr-2.5 object-contain" />
        <span>Login with Google</span>
      </Button>
    </div>
  );
};
export default SocialAuthForm;
