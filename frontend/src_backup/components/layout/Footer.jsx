import React from 'react';
import "../../assets/css/elements/footer.css";
import { links } from "config/linkConfigs";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="cgds footer">
            <section className="footer-top bg-primary">
                <div className="container-fluid p-8">
                    <div className="row">
                        {/* Quick Links Column */}
                        <div className="col-lg-3 col-md-6 col-sm-6" style={{paddingLeft: '120px'}}>
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
                        <div className="col-lg-2 col-md-4 col-sm-4">
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

                        <div className="col-lg-4 col-md-8 col-sm-8">
                            <div className="h3">{t('footer.contactUs')}</div>
                            <ul className="links">
                                <li className="flex items-start gap-2">
                                    <a
                                        href="https://maps.app.goo.gl/esNf6Hn65RCJJduz5"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex no-external-icon items-start gap-2 hover:text-blue-600 transition-colors !after:content-none !after:hidden"
                                        style={{ "&::after": { content: "none", display: "none" } }}
                                    >
                                        <MapPin size={16} className="text-gray-500 mt-1 flex-shrink-0"/>
                                        <span>{t('footer.contactInfo.address')}</span>
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone size={16} className="text-gray-500"/>
                                    <a
                                        href={`tel:${t('footer.contactInfo.phone').replace(/\s+/g, '')}`}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {t('footer.contactInfo.phone')}
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail size={16} className="text-gray-500"/>
                                    <a
                                        href={`mailto:${t('footer.contactInfo.email')}`}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {t('footer.contactInfo.email')}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-2 color-primary">
                <div className="d-flex justify-content-center text-start">
                    {t('footer.copyright', {year: currentYear})}
                </div>
            </section>
        </footer>
    );
};

export default Footer;