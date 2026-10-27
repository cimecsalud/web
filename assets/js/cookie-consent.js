// Cookie Consent Management
(function() {
    'use strict';

    const COOKIE_NAME = 'cookie-consent';
    const COOKIE_EXPIRY_DAYS = 365;

    // Check if consent cookie exists
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Set cookie
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
    }

    function showBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.hidden = false;
            banner.classList.add('show');
        }
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
            banner.hidden = true;
        }
    }

    // Accept cookies
    function acceptCookies() {
        setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
        hideBanner();

        // Load analytics or other tracking scripts here if needed
        loadAnalytics();
    }

    // Reject cookies (also used to withdraw a previous acceptance)
    function rejectCookies() {
        setCookie(COOKIE_NAME, 'rejected', COOKIE_EXPIRY_DAYS);
        hideBanner();
        disableAnalytics();
    }

    // Stop GA4 for this page and remove its cookies
    function disableAnalytics() {
        if (GA4_ID) {
            window[`ga-disable-${GA4_ID}`] = true;
        }
        const rootDomain = location.hostname.split('.').slice(-2).join('.');
        document.cookie.split(';').forEach(function(cookie) {
            const name = cookie.split('=')[0].trim();
            if (name === '_ga' || name.startsWith('_ga_')) {
                [location.hostname, `.${rootDomain}`].forEach(function(domain) {
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domain}`;
                });
                document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
        });
    }

    // GA4 Measurement ID, injected from hugo.toml (params.ga4_id)
    const GA4_ID = document.currentScript && document.currentScript.dataset.ga4Id;
    let analyticsLoaded = false;

    // Classify a link as a contact conversion, or null if it is not one
    function contactMethod(link) {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('tel:')) return 'telefono';
        if (href.startsWith('mailto:')) return 'email';
        if (href.includes('citaonline.portalns.es')) return 'cita_online';
        if (href.includes('nshpaciente.portalns.es')) {
            return href.includes('/registrar/') ? 'registro_portal' : 'acceso_portal';
        }
        return null;
    }

    // Load analytics (only if cookies are accepted)
    function loadAnalytics() {
        if (!GA4_ID || analyticsLoaded) return;
        analyticsLoaded = true;

        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function() { window.dataLayer.push(arguments); };
        window.gtag('js', new Date());
        window.gtag('config', GA4_ID, { allow_google_signals: false });

        // GA4 attributes each event to the session's UTM source/medium/campaign
        document.addEventListener('click', function(event) {
            const link = event.target.closest('a[href]');
            if (!link) return;
            const method = contactMethod(link);
            if (method) {
                window.gtag('event', 'contacto', { metodo: method });
            }
        });
    }

    // Initialize
    function init() {
        const consent = getCookie(COOKIE_NAME);

        if (!consent) {
            // No consent cookie, show banner
            showBanner();
        } else if (consent === 'accepted') {
            // Cookies accepted, load analytics
            loadAnalytics();
        }

        // Event listeners
        const acceptBtn = document.getElementById('cookie-consent-accept');
        const rejectBtn = document.getElementById('cookie-consent-reject');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCookies);
        }

        if (rejectBtn) {
            rejectBtn.addEventListener('click', rejectCookies);
        }

        // "Configurar cookies" links let the user change their choice at any time
        document.querySelectorAll('.cookie-settings-link').forEach(function(btn) {
            btn.addEventListener('click', showBanner);
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
