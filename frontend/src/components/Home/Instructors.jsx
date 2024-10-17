const Instructors = () => {
    return (
        <>
            <div id="instructors" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner py-8 text-center">
                    <div className="carousel-item active">
                        <div className="d-flex flex-column align-items-center w-75 mx-auto">
                            <div className="circular-image">
                                <img src="/MV5BMzdiYWE1NDgtMmZhZS00ZmU4LWI5ZmItMTEzZDlkY2ViYzBlXkEyXkFqcGdeQWFybm8@._V1_QL75_UY281_CR0,0,500,281_.jpg" className="rounded-circle img-fluid" alt="Robert Oppenheimer"
                                     style={{width: "200px", height: "200px", objectFit: "cover"}}/>
                            </div>
                            <h3 className="mt-4 text-center">Robert Oppenheimer, Ph.D.</h3>
                            <p className="text-center">Physicist, Theoretical Science</p>
                            <p className="px-4 text-center">
                                Dr. Robert Oppenheimer is renowned as the "father of the atomic bomb" for his role in
                                the Manhattan Project. A distinguished theoretical physicist, Oppenheimer's work
                                revolutionized modern physics and laid the groundwork for quantum mechanics.
                            </p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <div className="d-flex flex-column align-items-center w-75 mx-auto">
                            <div className="circular-image">
                                <img src="/x-men-first-class-james-mcavoy-as-charles-xavier.avif" className="rounded-circle img-fluid" alt="Charles Xavier"
                                     style={{width: "200px", height: "200px", objectFit: "cover"}}/>
                            </div>
                            <h3 className="mt-4 text-center">Charles Xavier, Ph.D.</h3>
                            <p className="text-center">Professor, Mutant Genetics</p>
                            <p className="px-4 text-center">
                                Professor Charles Xavier, also known as Professor X, is a visionary leader and founder
                                of the X-Men. His research into human mutation has helped bridge the gap between
                                mutants and humans, advocating for peace and understanding.
                            </p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <div className="d-flex flex-column align-items-center w-75 mx-auto">
                            <div className="circular-image">
                                <img src="/Austrian-psychoanalyst-Sigmund-Freud-1935.webp" className="rounded-circle img-fluid" alt="Sigmund Freud"
                                     style={{width: "200px", height: "200px", objectFit: "cover"}}/>
                            </div>
                            <h3 className="mt-4 text-center">Sigmund Freud, M.D.</h3>
                            <p className="text-center">Neurologist, Psychoanalysis</p>
                            <p className="px-4 text-center">
                                Dr. Sigmund Freud is the founder of psychoanalysis, a groundbreaking approach to human
                                psychology. His theories on the unconscious mind, repression, and dreams have
                                fundamentally changed our understanding of mental processes.
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
