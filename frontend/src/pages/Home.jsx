import Header from "../components/Header";

const Home = () => {
    return (
        <>
            <Header />
            <div className="container">
                <div className="row">
                    <div className="col-4 d-flex justify-content-center align-items-center">
                        <div className="poppins-extrabold color-red" style={{fontSize: "2em"}}>
                            Learn the skills, <br/>
                            Land your dream job.
                        </div>
                    </div>
                    <div className="col-8">
                        <img src="/humans.png" alt="humans" className="img-fluid" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
