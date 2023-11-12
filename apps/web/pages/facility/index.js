import React, { useEffect } from "react";
import Layout from "../components/layout";

export default function Facility() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  });
  return <Layout></Layout>;
}
