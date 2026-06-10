import React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

const TurnstileCaptcha = ({ onVerify }) => {
    // 1x00000000000000000000AA is the Cloudflare always-pass dummy key for development
    // In production, this should be an env variable like process.env.REACT_APP_TURNSTILE_SITE_KEY
    const siteKey = process.env.REACT_APP_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

    return (
        <div className="my-2">
            <Turnstile
                siteKey={siteKey}
                onSuccess={(token) => onVerify(token)}
                onError={() => onVerify(null)}
                onExpire={() => onVerify(null)}
            />
        </div>
    );
};

export default TurnstileCaptcha;
