import React, { useEffect } from "react";
import Layout from "../../components/layout";
import axios from "axios";
import { api } from "../../utils/constants";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";
import Wizard from "../../components/wizard";

export default function Register() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [phone, setPhone] = React.useState("+2547");
  const role = "FACILITYADMIN";
  const [confirmPassword, setConfirmPassword] = React.useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!role || !password || !phone) {
      setLoading(false);
      enqueueSnackbar("All fields are required", { variant: "error" });
      return;
    }
    try {
      await axios
        .post(`${api}/auth/signup`, { phone, password, role })
        .then((res) => {
          if (res.status == 201) {
            localStorage.setItem("isVerified", false);
            router.push({
              pathname: "/verify",
              query: { phone: phone },
            });
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
        <Wizard activeStep={1} />
        <div className="row ">
          <div className="col-md-4 offset-md-4 bg-white">
            <div className="p-3">
              <form onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    placeholder="+2547.."
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    required
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
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                    required
                  />
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
                      Register
                    </button>
                  )}
                </div>
              </form>
              <div className="text-center">
                <p>
                  Have an account?{" "}
                  <p className="link">
                    <Link href={"/login"}>Login</Link>
                  </p>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
