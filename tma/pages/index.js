import { useEffect } from "react";
import { useRouter } from "next/router";

// The home page has no UI of its own; it only sends the user to the right page
export default function Home() {
  const router = useRouter();

  useEffect(function () {
    const savedUser = localStorage.getItem("currentUser");

    if (savedUser) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, []);

  return null;
}
