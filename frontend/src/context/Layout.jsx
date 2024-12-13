import React, { useState, useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { AuthProvider } from "./authContext";
import { I18nextProvider, useTranslation } from "react-i18next";

const Layout = ({ children }) => {
    const { i18n } = useTranslation();
    const [isKhmer, setIsKhmer] = useState(i18n.language === "km");

    useEffect(() => {
        const handleLanguageChange = () => {
            setIsKhmer(i18n.language === "km");
        };

        i18n.on("languageChanged", handleLanguageChange);

        return () => {
            i18n.off("languageChanged", handleLanguageChange);
        };
    }, [i18n]);

    return (
        <I18nextProvider i18n={i18n}>
            <AuthProvider>
                <div
                    className="layout-wrapper"
                    style={{
                        fontFamily: isKhmer ? "Kantumruy Pro, sans-serif" : "inherit",
                    }}
                >
                    <Header />
                    <main className="content mt-32">{children}</main>
                    <Footer />
                </div>
            </AuthProvider>
        </I18nextProvider>
    );
};

export default Layout;
