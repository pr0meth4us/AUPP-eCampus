import React from 'react';
import "../../assets/css/elements/footer.css";
import { links } from "config/linkConfigs";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="cgds footer">
            <section className="footer-top bg-primary">
                <div className="container-fluid p-8">
                    <div className="row">
                        {/* Quick Links Column */}
                        <div className="col-lg-3 col-md-6 col-sm-6" style={{ paddingLeft: '120px' }}>
                            <div className="h3">{t('footer.quickLinks')}</div>
                            <ul className="links">
                                {links.quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.url}>
                                            {t(`footer.links.${['history', 'vision', 'faqs', 'career', 'weather'][index]}`)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Explore Column */}
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="h3">{t('footer.explore')}</div>
                            <ul className="links">
                                {links.explore.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.url}>
                                            {t(`footer.links.${['studentLife', 'news', 'tuitionFees', 'scholarships', 'contactUs'][index]}`)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Schools Column */}
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="h3">{t('footer.schools')}</div>
                            <ul className="links">
                                {links.schools.map((link, index) => (
                                    <li key={index}>
                                        <a href={link.url}>
                                            {t(`footer.links.${['schoolLiberalArts', 'schoolBusiness', 'schoolDigital', 'schoolLaw', 'schoolGraduate'][index]}`)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Column */}
                        <div className="col-lg-3 col-md-6 col-sm-6">
                            <div className="h3">{t('footer.contactUs')}</div>
                            <ul className="links">
                                <li>{t('footer.contactInfo.address')}</li>
                                <li>{t('footer.contactInfo.phone')}</li>
                                <li>{t('footer.contactInfo.email')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-2 color-primary">
                <div className="d-flex justify-content-center text-start">
                    {t('footer.copyright', { year: currentYear })}
                </div>
            </section>
        </footer>
    );
};

export default Footer;