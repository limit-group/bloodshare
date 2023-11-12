import React, { useEffect, useState } from "react";
import DonationForm from "../../components/donationForm";
import Layout from "../../components/layout";

export default function AddRecord() {
  const [role, setRole] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    let result = localStorage.getItem("role");
    setRole(result);
    if (!token | undefined | !result) {
      return router.push("/login");
    }
  });
  return (
    <Layout>
      <DonationForm props={role} />
    </Layout>
  );
}
