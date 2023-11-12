import axios from "axios";
import React, { useEffect } from "react";
import { api } from "../utils/constants";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import { useRouter } from "next/router";

export default function RequestForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [request, setRequest] = React.useState({
    patientName: "",
    relationship: "Hospital Patient",
    bloodGroup: "",
    needed: "",
    latitude: "",
    longitude: "",
    biography: "",
    diagnosis: "",
    when: new Date(),
    requestType: "OTHERS",
  });

  const handleChange = (e) => {
    setRequest({
      ...request,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return router.push("/login");
    }
    // set location asap
    if ("geolocation" in navigator) {
      console.log("Available");
      navigator.geolocation.getCurrentPosition(function (position) {
        setRequest({
          ...request,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        console.log("Latitude is :", position.coords.latitude);
        console.log("Longitude is :", position.coords.longitude);
      });
    } else {
      console.log("Not Available");
    }
  }, []);

  const handleRequest = async (e) => {
    console.log(request);
    e.preventDefault();
    setLoading(true);
    if (!request.bloodGroup || !request.diagnosis || !request.needed) {
      enqueueSnackbar("Fill in all the details", { variant: "error" });
      setLoading(false);
      return;
    }

    if (!request.latitude || !request.longitude) {
      enqueueSnackbar("Enable location for best experience", {
        variant: "error",
      });
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      axios
        .post(`${api}/requests`, request, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            setLoading(false);
            router.push("/broadcast");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(getError(err), { variant: "error" });
      setLoading(false);
    }
  };
  return (
    <div className="container">
      <div className="row pt-4">
        <div className="offset-md-3 col-md-5 bg-white">
          <h3 className="text-center">Request Blood Donation</h3>
          <hr />
          <div className="p-3">
            <form onSubmit={handleRequest}>
              <div className="row">
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Blood group
                    </label>
                    <select
                      name="bloodGroup"
                      id=""
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">--select--</option>
                      <option value="A_POSITIVE">A-</option>
                      <option value="A_NEGATIVE">A+</option>
                      <option value="AB_POSITIVE">AB+</option>
                      <option value="AB_NEGATIVE">AB-</option>
                      <option value="B_POSITIVE">B+</option>
                      <option value="B_NEGATIVE">B-</option>
                      <option value="0_NEGATIVE">0-</option>
                      <option value="O_NEGATIVE">O-</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6 col-sm-12">
                  <div className="form-group">
                    <label htmlFor="needed" className="form-label">
                      Blood Units required.{" "}
                      <small className="text-end text-danger">
                        <b>{request.needed}</b>
                      </small>
                    </label>
                    <input
                      type="range"
                      className="form-range text-black"
                      min="1"
                      name="needed"
                      onChange={handleChange}
                      step={1}
                      max="4"
                      id="needed"
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-6 col-sm-6 col-lg-12">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      When
                    </label>
                    <p>* Today's Date is Selected</p>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="" className="form-label">
                  Patient Name
                </label>
                <input
                  type="text"
                  name="patientName"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label htmlFor="biography" className="form-label">
                  Patient Biography
                </label>
                <textarea
                  name="biography"
                  id=""
                  cols="20"
                  rows="2"
                  onChange={handleChange}
                  className="form-control"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="diagnosis" className="form-label">
                  Medical Diagnosis
                </label>
                <textarea
                  name="diagnosis"
                  id=""
                  cols="20"
                  rows="2"
                  onChange={handleChange}
                  className="form-control"
                ></textarea>
              </div>
              <br />

              <div className="text-center">
                <small>
                  * Your location will be shared with this request to enable
                  people trace where they need to donate.
                </small>
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
                    Create Request <i className="bi bi-arrow-right"></i>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
