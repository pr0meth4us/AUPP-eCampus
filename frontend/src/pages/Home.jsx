import LoginPage from "../components/Login";
import Signup from "../components/Signup";

const Home = () => {
    return (
        <>
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

export default Home