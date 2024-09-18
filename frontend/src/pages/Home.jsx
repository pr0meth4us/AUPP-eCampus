import LoginPage from "../components/Login";

const Home = () => {
    return (
        <>
            <button type="button" className="btn btn-primary cgds" data-bs-toggle="modal" data-bs-target="#login">
                Sign in
            </button>
            <LoginPage />
        </>
    )
}

export default Home