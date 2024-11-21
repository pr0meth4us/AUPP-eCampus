import React from 'react';
import Header from "../components/Home/Header";
import Footer from "../components/Footer";

const Layout = ({ children }) => {
    return (
        <div className="layout-wrapper">
            <Header />
            <main className="content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
