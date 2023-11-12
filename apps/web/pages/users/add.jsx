import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";

export default function AddUser() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const rol = localStorage.getItem("role");
    setRole(rol);
  });
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = useState({
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      axios
        .post(`${api}auth/create`, user, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.status == 201) {
            router.push("/verify");
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
        <div className="row ">
          <div className="col-md-4 offset-md-4 bg-white">
            
            <div className="p-2">
            <h3 className="text-center">Create A New User</h3>
              <form onSubmit={handleAdd}>
                {/* <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Facility Name.
                  </label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Makini Health"
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                  />
                </div> */}
                <br />
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+2547.."
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <br />
                <div className="form-group">
                  <label htmlFor="" className="form-label">
                    User Role
                  </label>
                  <select
                    name="role"
                    id=""
                    className="form-control"
                    onChange={handleChange}
                  >
                    <option value="">---pick role--</option>
                    <option value="USER">regular-user</option>
                    <option value="FACILITYUSER">facility-user</option>
                    <option value="FACILITYADMIN">facility-admin</option>
                    {role == "SUPERADMIN" && (
                      <option value="SUPERADMIN">super-admin</option>
                    )}
                  </select>
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
                      Create User
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
