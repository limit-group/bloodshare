import { useEffect } from "react";
import { useRouter } from "next/router";
import HomePage from "./home/index";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  });
  return (
    <>
      <HomePage />
    </>
  );
}
