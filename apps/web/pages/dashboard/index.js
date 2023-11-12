import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Card from "../../components/card";
import Layout from "../../components/layout";

export default function Dashboard() {
  const router = useRouter();
  const [role, setRole] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    setRole(localStorage.getItem("role"));

    // if (role == "USER") {
    //   router.push("/download");
    //   return;
    // }

    if (!token | undefined) {
      return router.push("/login");
    }
  });

  return (
    <Layout>
      <Card props={role} />
    </Layout>
  );
}
