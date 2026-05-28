(function () {
    'use strict';

    const modal = document.getElementById('portal-modal');
    if (!modal || typeof modal.showModal !== 'function') return;

    // Interceptar clicks a cualquier enlace al portal y abrir el modal en su lugar.
    document.addEventListener('click', function (event) {
        const link = event.target.closest('a[href*="nshpaciente"]');
        if (!link) return;
        // Si el enlace está dentro del modal, dejar que navegue normalmente.
        if (link.closest('#portal-modal')) return;
        event.preventDefault();
        modal.showModal();
    });

    // Cerrar al hacer click en el backdrop (fuera del contenido).
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.close();
        }
    });
})();
