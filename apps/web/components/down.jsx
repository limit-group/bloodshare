import Link from "next/link";
import React from "react";

export default function Down() {
  return (
    <div className="container pt-5">
      <h1 className="text-center">Join us in saving lives.</h1>
      <div className="justify-content-center text-center pb-5">
        <p>A drop is enough</p>
        <small>Get our mobile app and begin a transformative journey </small>
        <br />
        <Link href={"/download"}>
          <button className="btn hero_main_btn btn-lg">
            <i className="bi bi-google-play text-white"></i> Download App.
          </button>
        </Link>
      </div>
    </div>
  );
}
