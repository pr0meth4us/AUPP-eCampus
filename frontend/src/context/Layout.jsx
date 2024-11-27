import React from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {AuthProvider} from "./authContext";

const Layout = ({ children }) => {
    return (
        <AuthProvider>
            <div className="layout-wrapper">
                <Header />
                <main className="content mt-32">{children}</main>
                <Footer />
            </div>
        </AuthProvider>
    );
};

export default Layout;
