import React from 'react';
import Banner from "./Banner";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../assets/css/components/search-bar.css"
import "../assets/css/elements/header.css"
import {Link} from "react-router-dom";

const Header = () => {
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
                                placeholder="Search..."
                                className="form-control "
                                required
                            />
                            <span className="input-group-text bg-white search-icon">
                                <i className="bi bi-search"></i>
                            </span>
                        </div>
                    </form>
                    <div className="find-your-pathway">
                        <Link to="" className="color-primary">Find Your Pathway</Link>
                    </div>
                    <div className="login">
                        <button type="button" className="btn color-primary" data-bs-toggle="modal"
                                data-bs-target="#login">
                            Login
                        </button>
                    </div>
                    <div className="signup">
                        <button type="button" className="btn btn-danger signup cgds" data-bs-toggle="modal"
                                data-bs-target="#signup">
                            Join for free
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
