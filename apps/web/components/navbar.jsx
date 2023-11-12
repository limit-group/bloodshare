import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
  const router = useRouter();
  const [link, setLink] = useState(false);
  const [role, setRole] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setRole(role);
    if (token) {
      setLink(true);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <nav
      className="navbar navbar-expand "
      style={{ backgroundColor: "#fc7d7b" }}
    >
      <div className="container">
        <Link href="/">
          <h1 className="navbar-brand">BloodShare</h1>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ms-auto">
            {role == "FACILITYADMIN" ? (
              <>
                <li className="nav-item">
                  <Link href="/donation-records">
                    <p className="nav-link active fw-bold">Donation Records</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/broadcast">
                    <p className="nav-link active fw-bold">
                      Donation Brodcasts
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/donation">
                    <p className="nav-link active fw-bold">Donation Drives</p>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="#">
                    <p className="nav-link active fw-bold">Support</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="#">
                    <p className="nav-link active fw-bold">Learn</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="#">
                    <p className="nav-link active fw-bold">Safety</p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/download">
                    <p className="nav-link active fw-bold">Download</p>
                  </Link>
                </li>
              </>
            )}

            {role == "SUPERADMIN" && (
              <li className="nav-item">
                <Link href="/facility">
                  <p className="nav-link active fw-bold">Health Facilities</p>
                </Link>
              </li>
            )}

            {link ? (
              <>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle fw-bold btn"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle icon "></i> {role}
                  </button>
                  <ul className="dropdown-menu">
                    <Link href="/settings">
                      <li className="dropdown-item">
                        <i className="bi bi-gear"></i> Settings
                      </li>
                    </Link>
                    <Link href="/users/edit">
                      <li className="dropdown-item">
                        <i className="bi bi-pen"></i> Edit Profile
                      </li>
                    </Link>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li className="dropdown-item">
                      <button onClick={handleLogout} className="btn">
                        <i className="bi bi-box-arrow-right"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link href="/login">
                  <button className="btn hero_sec_btn">Login</button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
