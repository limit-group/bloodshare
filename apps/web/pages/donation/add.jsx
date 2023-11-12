import { useRouter } from "next/router";
import React, { useEffect } from "react";
import DriveForm from "../../components/driveForm";
import Layout from "../../components/layout";

export default function AddDonation() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  });
  return (
    <Layout>
      <div>
        <DriveForm />
      </div>
    </Layout>
  );
}
