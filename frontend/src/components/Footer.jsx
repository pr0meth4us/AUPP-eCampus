import "../assets/css/elements/footer.css";

const Footer = () => {
    return (
        <>
            <footer className="cgds footer">
                <section className="footer-top bg-primary">
                    <div className="container-fluid p-8">
                        <div className="row">
                            {/* Quick Links Column */}
                            <div className="col-lg-3 col-md-6 col-sm-6" style={{paddingLeft:'120px'}}>
                                <div className="h3">Quick Links</div>
                                <ul className="links">
                                    <li><a href="">History</a></li>
                                    <li><a href="">Vision - Mission - Value</a></li>
                                    <li><a href="">FAQ</a></li>
                                    <li><a href="">Career Opportunities</a></li>
                                    <li><a href="">Current Weather at AUPP</a></li>
                                </ul>
                            </div>
                            {/* Explore Column */}
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="h3">Explore</div>
                                <ul className="links">
                                    <li><a href="">Student Life</a></li>
                                    <li><a href="">News & Events</a></li>
                                    <li><a href="">Tuition Fee</a></li>
                                    <li><a href="">Scholarships</a></li>
                                    <li><a href="">Contact Us</a></li>
                                </ul>
                            </div>
                            {/* Schools Column */}
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="h3">Schools</div>
                                <ul className="links">
                                    <li><a href="">School of Liberal Arts and Sciences</a></li>
                                    <li><a href="">School of Business</a></li>
                                    <li><a href="">School of Digital Technologies</a></li>
                                    <li><a href="">School of Law</a></li>
                                    <li><a href="">School of Graduate Studies</a></li>
                                </ul>
                            </div>
                            {/* Contact Us Column */}
                            <div className="col-lg-3 col-md-6 col-sm-6">
                                <div className="h3">Contact Us</div>
                                <ul className="links">
                                    <li>Address: #278H, Street 201R, Kralokor Village, Sangkat Kilometer 6, Khan Russey Keo, Phnom Penh, Cambodia</li>
                                    <li>Phone: (+855) 23 990 023</li>
                                    <li>Email: <a href="mailto:info@aupp.edu.kh">info@aupp.edu.kh</a></li>
                                    <li>
                                        <a href="https://facebook.com" className="social-icon">Facebook</a>
                                        <a href="https://telegram.org" className="social-icon">Telegram</a>
                                        <a href="https://instagram.com" className="social-icon">Instagram</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="py-2 color-primary">
                    <div className="d-flex justify-content-center text-start">
                        © Copyright 2023 American University of Phnom Penh, All Rights Reserved.
                    </div>
                </section>
            </footer>
        </>
    );
};

export default Footer;