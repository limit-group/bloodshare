import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import axios from "axios";
import { api } from "../../utils/constants";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import Wizard from "../../components/wizard";
import { getError } from "../../utils/error";
import Link from "next/link";
import Image from "next/image";

export default function Register() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const [facility, setFacility] = useState({
    name: "",
    email: "",
    mission: "",
    latitude: "",
    longitude: "",
    city: "",
    country: "",
    mission: "",
    licenseNumber: "",
    license: "",
  });

  const handleChange = (e) => {
    setFacility({
      ...facility,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setFacility({
      ...facility,
      license: e.target.files[0],
    });
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const { phone } = router.query;
    const formdata = new FormData();
    formdata.append("phone", phone);
    formdata.append("fname", facility.name);
    formdata.append("email", facility.email);
    formdata.append("city", facility.city);
    formdata.append("country", facility.country);
    formdata.append("longitude", facility.longitude);
    formdata.append("latitude", facility.latitude);
    formdata.append("mission", facility.mission);
    formdata.append("license", facility.license);
    formdata.append("licenseNumber", facility.licenseNumber);

    console.log(formdata);
    if (formdata) {
      try {
        setLoading(true);
        axios.post(`${api}/auth/facility`, formdata).then((res) => {
          setLoading(false);
          if (res.status == 201) {
            router.push("/login");
          } else {
            setLoading(false);
            enqueueSnackbar("failed to add facility", { variant: "error" });
          }
        });
      } catch (err) {
        setLoading(false);
        console.log(err);
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    }
  };

  useEffect(() => {
    // set location asap
    if ("geolocation" in navigator) {
      console.log("Available");
      navigator.geolocation.getCurrentPosition(function (position) {
        setFacility({
          ...facility,
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
  return (
    <Layout>
      <div className="container pt-5">
        <Wizard activeStep={3} />
        <div className="row ">
          <div className="col-md-5 offset-md-4 bg-white">
            <div className="p-3">
              <div className="text-center">
                <p>
                  This information will be verified before you can have full
                  application service.
                </p>
              </div>
              <hr />
              <form onSubmit={handleAdd}>
                <div className="row">
                  <div className="col-lg-12 col-sm-12">
                    <div className="text-center">
                      {facility.license && (
                        <Image
                          src={file}
                          alt={"preview"}
                          height={100}
                          width={100}
                        />
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Facility Name.
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <br />
                  <div className="col-lg-12 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Facility Email
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        placeholder="health@mail.com"
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="city" className="form-label">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        placeholder="Nairobi"
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="country" className="form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        name="country"
                        id="country"
                        placeholder="Kenya"
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
                <br />
                <div className="row">
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="licenseNumber" className="form-label">
                        Facility License Number
                      </label>
                      <input
                        type="text"
                        name="licenseNumber"
                        placeholder="xxxxx"
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                      <label htmlFor="license" className="form-label">
                        Upload License Image
                      </label>
                      <br />
                      {facility.license ? (
                        <i
                          className="bi bi-check text-success text-center"
                          style={{ fontSize: "40px" }}
                        ></i>
                      ) : (
                        <input
                          type="file"
                          name="license"
                          id="license"
                          placeholder=""
                          onChange={handleImage}
                          className="form-control-file"
                          required
                        />
                      )}
                    </div>
                  </div>
                </div>
                <br />
                <div className="col-lg-12">
                  <div className="form-group">
                    <label htmlFor="mission" className="form-label">
                      Facility Mission
                    </label>
                    <textarea
                      id="mission"
                      name="mission"
                      cols="30"
                      rows="3"
                      onChange={handleChange}
                      className="form-control"
                      required
                    ></textarea>
                  </div>
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
                      Complete Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="text-center alert alert-info">
          <p>
            Are you in doubt?. Review our{" "}
            <Link href="/policy">Privacy Policy</Link>. Thank You
          </p>
        </div>
      </div>
    </Layout>
  );
}
