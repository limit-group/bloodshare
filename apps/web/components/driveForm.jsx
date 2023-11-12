import axios from "axios";
import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { getError } from "../utils/error";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../utils/constants";
import Image from "next/image";


export default function DriveForm() {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  const [file, setFile] = useState("");
  const [feed, setFeed] = useState({
    media: "",
    description: "",
  });

  const handleChange = (e) => {
    setFeed({
      ...feed,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    setFeed({
      ...feed,
      media: e.target.files[0],
    });
    setFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleDrive = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("media", feed.media);
      formData.append("description", feed.description);

      if (formData) {
        axios
          .post(`${api}/feeds`, formData, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            if (res.status == 201) {
              router.push("/donation");
            }
          })
          .catch((err) => {
            setLoading(false);
            enqueueSnackbar(getError(err), { variant: "error" });
          });
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(getError(err), { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return router.push("/login");
    }
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-4 offset-md-4 bg-white">
          <h5 className="text-center">Announce a blood donation drive</h5>
          <div className="p-3">
            <form onSubmit={handleDrive}>
              <div className="text-center">
                {feed.media && (
                  <Image src={file} alt={"preview"} height={100} width={100} />
                )}
              </div>

              <div className="form-group">
                <label htmlFor="" className="form-label">
                  About the donation drive.
                </label>
                <textarea
                  name="description"
                  id=""
                  cols="30"
                  rows="5"
                  className="form-control"
                  onChange={handleChange}
                ></textarea>
              </div>
              <br />
              <div className="form-group">
                <label htmlFor="" className="form-label">
                  drive poster
                </label>
                <input
                  type="file"
                  name={"media"}
                  onChange={handleImage}
                  className="form-control-file"
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
                    Announce Drive
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
