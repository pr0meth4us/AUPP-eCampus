import Header from "../components/Home/Header";
import Instructors from "../components/Home/Instructors";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <>
<<<<<<< HEAD
            <button type="button" className="btn btn-primary cgds" data-bs-toggle="modal" data-bs-target="#login">
                Login
            </button>
            <button type="button" className="btn btn-primary cgds" data-bs-toggle="modal" data-bs-target="#signup">
                Sign up
            </button>
            <LoginPage/>
            <Signup/>
        </>
    )
}
=======
            <Header />
                <div className="row">
                    <div className="col-4 d-flex flex-column justify-content-center align-items-center">
                        <div className="poppins-extrabold color-red" style={{ fontSize: "2em" }}>
                            Learn the skills, <br />
                            Land your dream job.
                        </div>
                        <div className="container-fluid mt-4">
                            <div className="d-flex justify-content-between w-100">
                                <button className="btn btn-danger border-straight flex-grow-1 mx-2">
                                    Start Learning
                                </button>
                                <button className="btn border-straight btn-outline-danger color-red flex-grow-1 mx-2">
                                    Start Learning
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        <img src="/humans.png" alt="humans" className="img-fluid" />
                    </div>
>>>>>>> 83736d4eac30d6a83a10e5cac7c3250b47be7cc9

                {/* Ensure this section takes up the full width */}
                <div className="row bg-red py-4 text-white w-100 mx-0">
                    <div className="col-3 d-flex flex-column align-items-center text-center">
                        <img src="/People.svg" alt="" />
                        <div className="h5">Active Users</div>
                    </div>
                    <div className="col-3 d-flex flex-column align-items-center text-center">
                        <img src="/Knowledge%20Sharing.svg" alt="" />
                        <div className="h5">Available Courses</div>
                    </div>
                    <div className="col-3 d-flex flex-column align-items-center text-center">
                        <img src="/Diploma.svg" alt="" />
                        <div className="h5">Students Obtained a Job</div>
                    </div>
                    <div className="col-3 d-flex flex-column align-items-center text-center">
                        <img src="/Happy.svg" alt="" />
                        <div className="h5">User Satisfaction</div>
                    </div>
                </div>
            </div>
            <div className="instuctor pt-8 text-center">
                <p className="h1 color-primary">Our Instructors</p>
                <Instructors />
            </div>
            <div className="row partners">
                <img src="/partners.png" alt=""/>
            </div>
            <Footer />
        </>
    );
};

export default Home;
