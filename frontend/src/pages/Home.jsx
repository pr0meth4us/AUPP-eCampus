import Instructors from "../components/Home/Instructors";
import { Link } from "react-router-dom";
import "../assets/css/home.css"; // Import the CSS file

const Home = () => {
    return (
        <>
            <div className="main-content"> {/* Apply the main-content class here */}
                <div className="row">
                    <div className="d-flex mt-7" style={{ marginLeft: "200px" }}>
                        <div className="col-4 d-flex flex-column justify-content-center align-items-start">
                            <div
                                className="poppins-extrabold text-start"
                                style={{ fontSize: "2.5em", marginLeft: "20px", color: "#202F64", lineHeight: "1.2" }}
                            >
                                Master Your Skills <br />
                                Unlock Your Future
                            </div>
                            <div
                                className="text-start"
                                style={{ marginLeft: "20px", marginTop: "10px", color: "#202F64", fontWeight: "500" }}
                            >
                                Expert guidance to build the key skills that elevate your career success.
                            </div>
                            <div className="container-fluid mt-4">
                                <div className="d-flex justify-content-start w-100">
                                    <Link
                                        to="/course-catalog"
                                        className="btn btn-danger border-straight flex-grow-1 me-2"
                                    >
                                        Start Learning
                                    </Link>
                                    <button className="btn border-straight btn-outline-danger color-red flex-grow-1 mx-2">
                                        Explore Subjects
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            <img src="/humans.png" alt="humans" className="img-fluid" />
                        </div>
                    </div>

                    <div
                        className="row bg-red text-white w-100 mx-0 d-flex align-items-center"
                        style={{ height: "340px" }}
                    >
                        <div className="col-3 d-flex flex-column align-items-center text-center">
                            <img src="/People.svg" alt="" />
                            <div className="h1">10 000+</div>
                            <div className="h4">Active Users</div>
                        </div>
                        <div className="col-3 d-flex flex-column align-items-center text-center">
                            <img src="/Knowledge%20Sharing.svg" alt="" />
                            <div className="h1">120</div>
                            <div className="h4">Available Courses</div>
                        </div>
                        <div className="col-3 d-flex flex-column align-items-center text-center">
                            <img src="/Diploma.svg" alt="" />
                            <div className="h1">95%</div>
                            <div className="h4">Students Obtained a Job</div>
                        </div>
                        <div className="col-3 d-flex flex-column align-items-center text-center">
                            <img src="/Happy.svg" alt="" />
                            <div className="h1">99%</div>
                            <div className="h4">User Satisfaction</div>
                        </div>
                    </div>
                </div>
                <div className="instuctor pt-8 text-center">
                    <p className="h1 color-primary">Our Instructors</p>
                    <Instructors />
                </div>
                <div className="row partners">
                    <img src="/partners.png" alt="" />
                </div>
            </div>
        </>
    );
};

export default Home;
