import React from "react";
import Layout from "../../components/layout";
import axios from "axios";
import { api } from "../../utils/constants";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSnackbar } from "notistack";
import Wizard from "../../components/wizard";
import { getError } from "../../utils/error";

export default function Verify() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [code, setCode] = React.useState("");
  const { phone } = router.query;
  console.log(phone);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${api}/auth/verify`, { code, phone }).then((res) => {
        if (res.status == 200) {
          localStorage.setItem("isVerified", true);
          router.push({
            pathname: "/facility/add",
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
      <div className="container pt-5">
        <Wizard activeStep={2} />
        <div className="row ">
          <div className="col-md-4 offset-md-4 bg-white">
            <div className="p-3">
              <form onSubmit={handleVerify}>
                <br />
                <div className="form-group text-center">
                  <label htmlFor="" className="form-label">
                    Enter the unique code delivered to your phoneNumber.
                  </label>
                  <input
                    type="number"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="form-control"
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
                      Verify
                    </button>
                  )}
                </div>
              </form>
              <div className="text-center alert alert-info">
                <p>
                  Please get facility details like email, licences ready for
                  next step.Thank You
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
