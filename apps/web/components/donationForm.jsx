import React, { useState } from "react";
import { api } from "../utils/constants";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

export default function DonationForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState({
    name: "",
    bloodType: "",
    bodyWeight: "",
    donationDate: new Date(),
    dateOfBirth: "",
    bloodUnit: "",
    bloodType: "",
  });

  const handleChange = (e) => {
    setRecord({
      ...record,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecord = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    console.log(record);
    axios
      .post(`${api}/records`, record, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 201) {
          setLoading(false);
          router.push("/donation-records");
        }
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar(getError(err), { variant: "error" });
        console.log(err);
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className=" bg-white">
          <div className="">
            <Link href={"/donation-records"}>
              <a className="text-black">
                <p>
                  <i className="bi bi-arrow-left"></i> Records
                </p>
              </a>
            </Link>
            <h3 className="text-center">Record Blood Donation</h3>
          </div>
          <div className="p-3 text-center">
            <form onSubmit={handleRecord}>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Donor Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id=""
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      id=""
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Birthday
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      id=""
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Blood Group
                    </label>
                    <select
                      name="bloodType"
                      id=""
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">--select--</option>
                      <option value="A_POSITIVE">A +</option>
                      <option value="A_NEGATIVE">A -</option>
                      <option value="B_POSITIVE">B +</option>
                      <option value="B_NEGATIVE">B -</option>
                      <option value="AB_POSITIVE">AB +</option>
                      <option value="AB_NEGATIVE">AB -</option>
                      <option value="O_POSITIVE">O +</option>
                      <option value="O_NEGATIVE">O -</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Body Weight
                    </label>
                    <input
                      type="number"
                      name="bodyWeight"
                      id=""
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Gender
                    </label>
                    <select
                      name="gender"
                      id=""
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="">--select--</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="NON_BINARY">Non binary</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="" className="form-label">
                      Units Donated
                    </label>
                    <input
                      type="number"
                      name="bloodUnit"
                      id=""
                      className="form-control"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className="text-center p-4">
                {loading ? (
                  <>
                    <div className="spinner-border text-danger" role="status">
                      <span className="sr-only"></span>
                    </div>
                  </>
                ) : (
                  <button type="submit" className="btn btn-lg hero_main_btn ">
                    Create Record
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
