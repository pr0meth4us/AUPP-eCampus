import { Link } from "react-router-dom";

const Banner = () => {
    return (
        <div className="banner bg-primary d-flex justify-content-center ">
            <div>
                <Link className="text-white" to="https://www.aupp.edu.kh/">AUPP |</Link>
            </div>
            <div>
                <Link className="text-white" to="/"> News & Events |</Link>
            </div>
            <div>
                <Link className="text-white" to="https://www.aupp.edu.kh/student-life/"> Student Life</Link>
            </div>
        </div>
    );
};

export default Banner;
