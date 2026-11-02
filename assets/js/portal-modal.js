(function () {
    'use strict';

    // Cada modal intercepta los enlaces que coinciden con su selector; los enlaces de dentro
    // del propio modal navegan con normalidad.
    //  - portal-modal: elegir entre acceder o registrarse en el Portal del Paciente.
    //  - cita-modal: recordar que la cita online hay que confirmarla desde el email.
    [
        { id: 'portal-modal', selector: 'a[href*="nshpaciente"]' },
        { id: 'cita-modal', selector: 'a[href*="citaonline.portalns.es"]' }
    ].forEach(function (cfg) {
        const modal = document.getElementById(cfg.id);
        if (!modal || typeof modal.showModal !== 'function') return;

        document.addEventListener('click', function (event) {
            const link = event.target.closest(cfg.selector);
            if (!link || link.closest('#' + cfg.id)) return;
            event.preventDefault();
            modal.showModal();
        });

        // Cerrar al hacer click en el backdrop (fuera del contenido).
        modal.addEventListener('click', function (event) {
            if (event.target === modal) modal.close();
        });
    });
})();
