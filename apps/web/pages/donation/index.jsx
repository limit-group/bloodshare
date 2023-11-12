import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { api, BASE } from "../../utils/constants";
import { getError } from "../../utils/error";

export default function Donation() {
  const router = useRouter();
  const [drives, setDrives] = useState([]);
  const [role, setRole] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const base = process.env.BASE;
  const getFeeds = async () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${api}/feeds/me`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setDrives(res.data);
      })
      .catch((err) => {
        enqueueSnackbar(getError(err), { variant: "error" });
        console.log(err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }

    getFeeds().catch((err) => {
      console.log(err);
    });
    const rol = localStorage.getItem("role");
    setRole(rol);
  }, []);
  return (
    <Layout>
      <div className="container ">
        <div className="text-end">
          <Link href={"/donation/add"}>
            <button className="btn hero_main_btn ">
              Announce Drive <i className="bi bi-arrow-right"></i>
            </button>
          </Link>
        </div>
        <table className="table ">
          <thead>
            <tr>
              <th scope="col">#</th>

              <th scope="col">information</th>
              <th scope="col">going</th>
              <th scope="col">createdAt</th>
              <th scope="col">media</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {drives.length > 0 ? (
              <>
                {drives.map((req) => (
                  <tr key={req.id}>
                    <th scope="row">*</th>
                    <td>{req.information}</td>
                    <td>{req.going}</td>
                    <td>{req.createdAt}</td>
                    <td>
                      {req.media && (
                        <Image
                          src={`${base}images/${req.media}`}
                          height={70}
                          width={70}
                          alt={req.information}
                          style={{ borderRadius: 50 }}
                        />
                      )}
                    </td>
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
            <th scope="col">#</th>
            <th scope="col">information</th>
            <th scope="col">going</th>
            <th scope="col">createdAt</th>
            <th scope="col">media</th>
            <th scope="col">Action</th>
          </tfoot>
        </table>
      </div>
    </Layout>
  );
}
