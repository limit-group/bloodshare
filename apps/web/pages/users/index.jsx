import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { api } from "../../utils/constants";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";
import Link from "next/link";

export default function Users() {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const loadUsers = () => {
    const token = localStorage.getItem("token");

    axios
      .get(`${api}/auth/users`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        enqueueSnackbar(getError(err), { variant: "error" });
      });
  };

  useEffect(() => {
    loadUsers();
    const rol = localStorage.getItem("role");
    setRole(rol);
  }, []);
  return (
    <Layout>
      <div className="container pt-5">
        <div className="text-end">
          <Link href={"/users/add"}>
            <button className="btn hero_main_btn ">
              Create User <i className="bi bi-arrow-right"></i>
            </button>
          </Link>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">phone-number</th>
              <th scope="col">verified</th>
              <th scope="col">role</th>
              <th scope="col">createdAt</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((req) => (
              <tr key={req.id}>
                <th scope="row">{req.id}</th>
                <td>{req.phoneNumber}</td>
                <td>{req.verified && "true"}</td>
                <td>{req.role}</td>
                <td>{req.createdAt}</td>
                <td>
                  {role == "SUPERADMIN" && <i className="bi bi-trash"></i>}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="col">#</th>
              <th scope="col">phone-number</th>
              <th scope="col">verified</th>
              <th scope="col">role</th>
              <th scope="col">createdAt</th>
              <th scope="col">Action</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </Layout>
  );
}
