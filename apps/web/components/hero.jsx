import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <div className="pt-5">
      <div className="container ">
        <div className="row">
          <h1 className="text-center">Begin a life-saving journey</h1>
          <div className="col-md-4 offset-md-4 bg-white">
            <div className="justify-content-center text-center">
              <br />
              <div className=" d-flex justify-content-center space-between">
                <Link href={"/register"}>
                  <button className="btn btn-lg hero_main_btn mx-5">
                    Join
                  </button>
                </Link>
                <Link href={"/login"}>
                  <button className="btn hero_sec_btn ">sign in</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center pt-5">
            <p className="lead">
              Join 100+ Health facilities using our service to improve how they
              handle blood donations.
            </p>
            <p>Try the free service today.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
