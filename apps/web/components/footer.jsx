import Link from "next/link";
import React from "react";
const Footer = () => {
  return (
    <footer className="footer pt-5" style={{ backgroundColor: "#fc7d7b"}}>
      <div className="justify-content-center text-center">
        <p className="lead">
          BloodShare{" "}
          <Link href={"/"}>
            <i className="bi bi-facebook icon"></i>
          </Link>{" "}
          <Link href={"/"}>
            <i className="bi bi-twitter icon"></i>
          </Link>{" "}
          <Link href={"/"}>
            <i className="bi bi-instagram icon"></i>
          </Link>
        </p>
        <div className="mx-auto d-inline-flex">
          <Link href="/privacy">
            <p className="">Privacy Policy</p>
          </Link>
          <Link href="/terms">
            <p className="">| Terms of Service |</p>
          </Link>
        </div>
        <small>&copy; 2023. Limit Group.</small>
      </div>
    </footer>
  );
};

export default Footer;
