const Instructors = () => {
    return (
        <>
            <div id="instructors" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner py-8 text-center">
                    <div className="carousel-item active">
                        <div
                            className="d-flex flex-column align-items-center w-75 mx-auto">
                            <div className="circular-image">
                                <img src="/picture.png" className="rounded-circle img-fluid" alt="Instructor 1"
                                     style={{width: "200px", height: "200px"}}/>
                            </div>
                            <h3 className="mt-4 text-center">Aruna Shankar, Ph.D.</h3>
                            <p className="text-center">Professor, Digital Technologies</p>
                            <p className="px-4 text-center">
                                Dr. Aruna Shankar is an accomplished professional with diverse expertise in the fields
                                of Information Technology Management and Software Engineering. With a passion for
                                technology and research, Mrs. Shankar has made significant contributions to the software
                                industry and academia over the years.
                            </p>
                        </div>
                    </div>
                    <div className="carousel-item active">
                        <div
                            className="d-flex flex-column align-items-center w-75 mx-auto">
                            <div className="circular-image">
                                <img src="/picture.png" className="rounded-circle img-fluid" alt="Instructor 1"
                                     style={{width: "200px", height: "200px"}}/>
                            </div>
                            <h3 className="mt-4 text-center">Aruna Shankar, Ph.D.</h3>
                            <p className="text-center">Professor, Digital Technologies</p>
                            <p className="px-4 text-center">
                                Dr. Aruna Shankar is an accomplished professional with diverse expertise in the fields
                                of Information Technology Management and Software Engineering. With a passion for
                                technology and research, Mrs. Shankar has made significant contributions to the software
                                industry and academia over the years.
                            </p>
                        </div>
                    </div>
                    <div className="carousel-item active">
                        <div
                            className="d-flex flex-column align-items-center w-75 mx-auto">
                            <div className="circular-image">
                                <img src="/picture.png" className="rounded-circle img-fluid" alt="Instructor 1"
                                     style={{width: "200px", height: "200px"}}/>
                            </div>
                            <h3 className="mt-4 text-center">Aruna Shankar, Ph.D.</h3>
                            <p className="text-center">Professor, Digital Technologies</p>
                            <p className="px-4 text-center">
                                Dr. Aruna Shankar is an accomplished professional with diverse expertise in the fields
                                of Information Technology Management and Software Engineering. With a passion for
                                technology and research, Mrs. Shankar has made significant contributions to the software
                                industry and academia over the years.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Carousel Controls */}
                <button className="carousel-control-prev text-black" type="button" data-bs-target="#instructors"
                        data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true">
                        <i className="bi bi-chevron-left fs-1 color-primary"></i>
                    </span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#instructors"
                        data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true">
                        <i className="bi bi-chevron-right fs-1 color-primary"></i></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </>
    )
}

export default Instructors;
