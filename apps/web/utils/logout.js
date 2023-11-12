import { useRouter } from "next/router";

export function Logout() {
  const router = useRouter();
  localStorage.removeItem("token");
  localStorage.removeItem("isVerified");
  localStorage.removeItem("role");
  router.push("/login");
}
