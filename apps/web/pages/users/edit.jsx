import axios from "axios";
import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import { api } from "../../utils/constants";
import { useSnackbar } from "notistack";
import { getError } from "../../utils/error";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Edit() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bodyWeight: "",
    gender: "",
    bloodPoints: "",
    dateOfBirth: "",
    bloodType: "",
    avatar: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const findUser = () => {
    const token = localStorage.getItem("token");
    axios
      .get(`${api}/auth/profiles`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => {
        enqueueSnackbar(getError(err), { variant: "error" });
        setLoading(false);
      });
  };
  useEffect(() => {
    findUser();
  }, []);

  const handleEdit = () => {
    const token = localStorage.getItem("token");
    axios
      .post(`${api}/auth/profiles/update`, profile, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          localStorage.setItem("profile", "complete");
          router.push("/dashboard");
          setLoading(false);
        }
      })
      .catch((err) => {
        enqueueSnackbar(getError(err), { variant: "error" });
        setLoading(false);
      });
  };
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4 bg-white">
            <h3 className="text-center">Edit Your Profile</h3>
            <div className="p-3">
              <form onSubmit={handleEdit} className="form">
                <div className="form-group">
                  <div className="text-center">
                    {profile.avatar && (
                      <Image
                        alt="preview"
                        src={profile.avatar}
                        height={100}
                        width={100}
                        style={{ borderRadius: 50 }}
                      />
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Names
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    id=""
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    id=""
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Life Saver Points
                  </label>
                  <input
                    type="number"
                    disabled
                    name="bloodPoints"
                    value={profile.bloodPoints}
                    onChange={handleChange}
                    id=""
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Birthday
                  </label>
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleChange}
                    id=""
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Blood Group
                  </label>
                  <input
                    type="text"
                    name="bloodType"
                    disabled
                    value={profile.bloodType}
                    onChange={handleChange}
                    id=""
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Body Weight
                  </label>
                  <input
                    type="number"
                    name="bodyWeight"
                    value={profile.bodyWeight}
                    onChange={handleChange}
                    id=""
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Gender
                  </label>
                  <input
                    type="text"
                    name="gender"
                    disabled
                    value={profile.gender}
                    onChange={handleChange}
                    id=""
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
                      Save
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
