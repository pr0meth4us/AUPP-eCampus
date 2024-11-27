import React, { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Recaptcha = ({ onVerify }) => {
    const [captchaValue, setCaptchaValue] = useState(null);
    const recaptchaRef = React.createRef();

    useEffect(() => {
        if (captchaValue) {
            onVerify(captchaValue);
        }
    }, [captchaValue, onVerify]);

    return (
        <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Ld3hFAqAAAAAGhDVoYuZI_iNrY1VqparJIE6RXN"
            onChange={setCaptchaValue}
        />
    );
};

export default Recaptcha;
