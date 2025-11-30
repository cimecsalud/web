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
    
    // Show banner
    function showBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.add('show');
        }
    }
    
    // Hide banner
    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('show');
        }
    }
    
    // Accept cookies
    function acceptCookies() {
        setCookie(COOKIE_NAME, 'accepted', COOKIE_EXPIRY_DAYS);
        hideBanner();
        
        // Load analytics or other tracking scripts here if needed
        loadAnalytics();
    }
    
    // Reject cookies
    function rejectCookies() {
        setCookie(COOKIE_NAME, 'rejected', COOKIE_EXPIRY_DAYS);
        hideBanner();
    }
    
    // Load analytics (only if cookies are accepted)
    function loadAnalytics() {
        // Add your analytics code here (Google Analytics, etc.)
        // Example:
        // if (typeof gtag !== 'undefined') {
        //     gtag('consent', 'update', {
        //         'analytics_storage': 'granted'
        //     });
        // }
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
    }
    
    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
