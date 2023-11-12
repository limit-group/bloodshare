import Link from "next/link";
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { api } from "../../utils/constants";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";
import axios from "axios";
import moment from "moment";

export default function Donations() {
  const { enqueueSnackbar } = useSnackbar();
  const [donations, setDonations] = useState([]);
  const [records, setRecords] = useState([]);

  const [role, setRole] = useState("");
  const loadData = () => {
    const token = localStorage.getItem("token");

    axios
      .get(`${api}/records`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDonations(res.data);
      })
      .catch((err) => {
        enqueueSnackbar(getError(err), { variant: "error" });
        console.log(err);
      });

    axios
      .get(`${api}/records/me`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRecords(res.data);
      })
      .catch((err) => {
        enqueueSnackbar(getError(err), { variant: "error" });
        console.log(err);
      });
  };

  useEffect(() => {
    loadData();
    const rol = localStorage.getItem("role");
    setRole(rol);
  }, []);
  return (
    <Layout>
      <div className="container">
        <div className="text-end">
          <Link href={"/donation-records/add"}>
            <button className="btn hero_main_btn ">
              Create Record <i className="bi bi-arrow-right"></i>
            </button>
          </Link>
        </div>
        <h3 className="text-center">Facility Blood Donation Records</h3>
        <div className="alert alert-info text-center">
          Issue the unique donation id's to the respective donors
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Date of Birth</th>
              <th scope="col">Body Weight(Kgs)</th>
              <th scope="col">Donation Date</th>
              <th scope="col">Donation ID</th>
              <th scope="col">Blood Units</th>
              <th scope="col">Created At</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              <>
                {records.map((req) => (
                  <tr key={req.id}>
                    <th scope="row">*</th>
                    <td>{req.name}</td>
                    <td>{req.phoneNumber}</td>
                    <td>{moment(req.dateOfBirth).format("Do MMM YY")}</td>
                    <td>{req.bodyWeight}</td>
                    <td>{moment(req.donationDate).format("Do MMM YY")}</td>
                    <td>{req.donationId}</td>
                    <td>{req.bloodUnits}</td>
                    <td>{moment(req.createdAt).format("Do MMM YY")}</td>

                    <td>
                      {role == "SUPERADMIN" ? (
                        <i className="bi bi-trash"></i>
                      ) : (
                        <i className="bi bi-pencil-square"></i>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <div className="text-center">
                <i class="bi bi-bug"></i> <p> no data to display</p>
                </div>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Date of Birth</th>
              <th scope="col">Body Weight</th>
              <th scope="col">Donation Date</th>
              <th scope="col">Donation ID</th>
              <th scope="col">Blood Units</th>
              <th scope="col">created At</th>
              <th scope="col">Action</th>
            </tr>
          </tfoot>
        </table>
        <div className="text-center">-----</div>
        {role == "SUPERADMIN" && (
          <>
            <h5 className="text-center">All Records</h5>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">facility</th>
                  <th scope="col">donation-id</th>
                  <th scope="col">donation-date</th>
                  <th scope="col">createdAt</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((req) => (
                  <tr key={req.id}>
                    <th scope="row">*</th>
                    <td>{req.facilityr}</td>
                    <td>{req.donorNumber}</td>
                    <td>{moment(req.donationDate).format("Dd MMM YY")}</td>
                    <td>{req.createdAt}</td>
                    <td>
                      <i className="bi bi-trash"></i>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">facility</th>
                  <th scope="col">donation-id</th>
                  <th scope="col">donation-date</th>
                  <th scope="col">createdAt</th>
                  <th scope="col">Action</th>
                </tr>
              </tfoot>
            </table>
          </>
        )}
      </div>
    </Layout>
  );
}
