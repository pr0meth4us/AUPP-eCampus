const instructorsData = [
    {
        name: "Robert Oppenheimer, Ph.D.",
        title: "Adjunct, Theoretical Science",
        description: `Dr. Robert Oppenheimer is renowned as the "father of the atomic bomb" for his role in the 
                      Manhattan Project. A distinguished theoretical physicist, Oppenheimer's work revolutionized 
                      modern physics and laid the groundwork for quantum mechanics.`,
        image: "/MV5BMzdiYWE1NDgtMmZhZS00ZmU4LWI5ZmItMTEzZDlkY2ViYzBlXkEyXkFqcGdeQWFybm8@._V1_QL75_UY281_CR0,0,500,281_.jpg",
        alt: "Robert Oppenheimer"
    },
    {
        name: "Charles Xavier, Ph.D.",
        title: "Professor, Mutant Genetics",
        description: `Professor Charles Xavier, also known as Professor X, is a visionary leader and founder 
                      of the X-Men. His research into human mutation has helped bridge the gap between 
                      mutants and humans, advocating for peace and understanding.`,
        image: "/x-men-first-class-james-mcavoy-as-charles-xavier.avif",
        alt: "Charles Xavier"
    },
    {
        name: "Sigmund Freud, M.D.",
        title: "Adjunct, Psychoanalysis",
        description: `Dr. Sigmund Freud is the founder of psychoanalysis, a groundbreaking approach to human psychology. 
                      His theories on the unconscious mind, repression, and dreams have fundamentally changed 
                      our understanding of mental processes.`,
        image: "/Austrian-psychoanalyst-Sigmund-Freud-1935.webp",
        alt: "Sigmund Freud"
    }
];

const InstructorCard = ({ name, title, description, image, alt }) => {
    return (
        <div className="d-flex flex-column align-items-center w-75 mx-auto">
            <div className="circular-image">
                <img
                    src={image}
                    className="rounded-circle img-fluid"
                    alt={alt}
                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                />
            </div>
            <p className="mt-3 mb-1 h3 title color-primary text-center">{name}</p>
            <p className="fw-bold mb-2 text-center">{title}</p>
            <p className="px-4 text-center">{description}</p>
        </div>
    );
};

const Instructors = () => {
    return (
        <div id="instructors" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner py-8 text-center">
                {instructorsData.map((instructor, index) => (
                    <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                        <InstructorCard {...instructor} />
                    </div>
                ))}
            </div>

            <button className="carousel-control-prev text-black" type="button" data-bs-target="#instructors" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true">
                    <i className="bi bi-chevron-left fs-1 color-primary"></i>
                </span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#instructors" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true">
                    <i className="bi bi-chevron-right fs-1 color-primary"></i>
                </span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
};

export default Instructors;
