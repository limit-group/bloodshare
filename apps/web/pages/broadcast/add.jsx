import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Layout from "../../components/layout";
import RequestForm from "../../components/requestForm";

export default function AddBroadCast() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  });
  return (
    <Layout>
      <RequestForm />
    </Layout>
  );
}
