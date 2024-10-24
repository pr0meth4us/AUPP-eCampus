import React from 'react';
import Banner from "./Banner";
import "../../assets/css/components/search-bar.css";
import "../../assets/css/elements/header.css";
import { Link } from "react-router-dom";
import LoginPage from "./Login";
import Signup from "./Signup";
import { useAuth } from "../../context/authContext";

const Header = () => {
    const { user } = useAuth();

    return (
        <>
            <Banner />
            <header className="bg-light py-3">
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="logo">
                        <a href="/">
                            <img src="/AUPP-Main-Logo.svg" alt="Logo" className="img-fluid" />
                        </a>
                    </div>

                    <form action="/search" method="GET" className="d-flex rounded-2xl">
                        <div className="input-group">
                            <input
                                type="text"
                                name="query"
                                placeholder="Search info..."
                                className="form-control"
                                required
                                style={{width: "300px"}}  // Adjust the width as needed
                            />
                            <span className="input-group-text bg-white search-icon">
                                <i className="bi bi-search"></i>
                            </span>
                        </div>
                    </form>


                    <div className="find-your-pathway">
                        <Link to="" className="color-primary" style={{fontWeight: "500"}}>Find Your Pathway</Link>
                    </div>

                    {user ? (
                        <i className="bi bi-person-circle" style={{fontSize: "2em"}}></i>
                    ) : (
                        <>
                            <button type="button" className="btn color-primary" data-bs-toggle="modal"
                                    data-bs-target="#login" style={{fontWeight: "500"}}>
                                Login
                            </button>
                            <LoginPage/>

                            <button type="button" className="btn btn-danger signup" data-bs-toggle="modal"
                                    data-bs-target="#signup">
                                Join for free
                            </button>
                            <Signup />
                        </>
                    )}
                </div>
            </header>
        </>
    );
};

export default Header;
