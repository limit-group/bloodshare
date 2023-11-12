import axios from "axios";
import Link from "next/link";
import React, { useEffect } from "react";
import { api } from "../../utils/constants";
import Layout from "../../components/layout";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      return router.push("/dashboard");
    }
  });

  const handleLogin = async (e) => {
    const { redirect } = router.query;
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${api}/auth/login`, { phone, password }).then((res) => {
        console.log(res);
        if (res.status == 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("role", res.data.role);
          if (res.data.role == "USER") {
            router.push("/download");
            return;
          }
          router.push("/dashboard" || redirect);
        }
      });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(getError(err), { variant: "error" });
      setLoading(false);
    }
  };
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4 bg-white">
            <h3 className="text-center">Welcome Back</h3>
            <div className="p-3">
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    name="mail"
                    placeholder="+2547597012.."
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    name={"password"}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="text-end">
                  <Link href="/users/forgot">
                    <small
                    className="fw-bold"
                      style={{ color: "#fc7d7b", textDecoration: "underline" }}
                    >
                      Forgot Password
                    </small>
                  </Link>
                </div>
                <br />
                <div className="text-center pb-4">
                  {loading ? (
                    <>
                      <div className="spinner-border text-danger" role="status">
                        <span className="sr-only"></span>
                      </div>
                    </>
                  ) : (
                    <button type="submit" className="btn btn-lg hero_main_btn ">
                      Login
                    </button>
                  )}
                </div>
              </form>
              <div className="text-center">
                <Link href={"/register"}>
                  <button className="btn btn-md hero_sec_btn ">
                    Create Facility Account
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
