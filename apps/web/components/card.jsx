import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Card({ props }) {
  return (
    <div className="container">
      <h2 className="text-center">Life Saving Activities</h2>
      <div className="row ">
        <div className="col-lg-3 col-md-4 col-sm-12">
          <div className="card">
            <Image
              height={200}
              width={300}
              alt={"one-night-stand"}
              src={"/map.svg"}
              className={"card-img-top"}
            />
            <div className="card-body text-center">
              <p>Donation Drives</p>
              <div className="justify-content-center text-center">
                <Link href={"/donation"}>
                  <button className="btn hero_main_btn">
                    Start Planning <i className="bi bi-arrow-right"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-12">
          <div className="card">
            <Image
              height={200}
              width={300}
              alt={"one-night-stand"}
              src={"/broadcast.svg"}
              cclassName={"card-img-top"}
            />
            <div className="card-body text-center">
              <p>BroadCast Emergency</p>
              <div className="justify-content-center text-center">
                <Link href={"/broadcast"}>
                  <button className="btn hero_main_btn ">
                    Start BroadCast <i className="bi bi-arrow-right"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-4 col-sm-12">
          <div className="card">
            <Image
              height={200}
              alt={"one-night-stand"}
              width={300}
              src={"/bank.svg"}
              cclassName={"card-img-top"}
            />
            <div className="card-body text-center">
              <p>Donation Records</p>
              <div className="justify-content-center text-center">
                <Link href={"/donation-records"}>
                  <button className="btn hero_main_btn ">
                    Manage <i className="bi bi-arrow-right"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        {props.role == "SUPERADMIN" ? (
          <>
            <div className="col-lg-3 col-md-4 col-sm-12">
              <div className="card">
                <Image
                  height={200}
                  alt={"one-night-stand"}
                  width={300}
                  src={"/people.png"}
                  cclassName={"card-img-top"}
                />
                <div className="card-body text-center">
                  <p>Users</p>
                  <div className="justify-content-center text-center">
                    <Link href={"/users"}>
                      <button className="btn hero_main_btn ">
                        Manage <i className="bi bi-arrow-right"></i>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
