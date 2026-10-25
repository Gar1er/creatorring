// 1. Cargamos directamente la lista oficial desde peleadores.js
// Ya no usamos localStorage para edición, todo se alimenta de tu archivo de datos.
let peleadores = listaPeleadoresOficial;

// 2. Función para pintar la tabla principal (solo con botón de ver ficha)
function cargarPeleadores(listaAImprimir) {
    const tbody = document.getElementById('fightersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = ""; 

    listaAImprimir.forEach(peleador => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td><strong>${peleador.nombreReal}</strong> <br><small>${peleador.alias}</small></td>
            <td>${peleador.record}</td>
            <td>${peleador.pais}</td>
            <td>
                <button onclick="verPerfil('${peleador.id}')">Ver Ficha</button>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

// Cargar la tabla al iniciar
cargarPeleadores(peleadores);

// 3. Ver Perfil Detallado
function verPerfil(peleadorId) {
    const peleador = peleadores.find(p => p.id === peleadorId);
    if (!peleador) return;

    // Ocultar buscador, tabla principal y título de destacados
    const searchSection = document.getElementById('searchInput').parentElement;
    const fightersTable = document.querySelector('.fighters-table');
    const tituloDestacados = document.querySelectorAll('main h2')[0];
    const eventsSection = document.querySelector('.events-section');

    if (searchSection) searchSection.style.display = 'none';
    if (fightersTable) fightersTable.style.display = 'none';
    if (tituloDestacados) tituloDestacados.style.display = 'none';
    if (eventsSection) eventsSection.style.display = 'none';

    // Mostrar sección de perfil
    const profileView = document.getElementById('profileView');
    profileView.style.display = 'block';

    // Rellenar datos básicos y foto
    document.getElementById('profileName').textContent = `${peleador.nombreReal} ("${peleador.alias}")`;
    document.getElementById('profileDetails').textContent = `Récord: ${peleador.record} | País: ${peleador.pais}`;
    
    const photoElement = document.getElementById('profilePhoto');
    if (photoElement) {
        photoElement.src = peleador.foto;
    }

    // Rellenar redes sociales
    const socialContainer = document.getElementById('profileSocials');
    if (socialContainer) {
        const ig = peleador.redes?.instagram || "#";
        const tw = peleador.redes?.twitter || "#";
        socialContainer.innerHTML = `
            <a href="${ig}" target="_blank" class="social-link">Instagram</a>
            <a href="${tw}" target="_blank" class="social-link">Twitter / X</a>
        `;
    }

    // Pintar la tabla de sus peleas
    renderizarHistorialPeleas(peleador);
}

// Función auxiliar para renderizar el historial de peleas
function renderizarHistorialPeleas(peleador) {
    const fightHistoryBody = document.getElementById('fightHistoryBody');
    fightHistoryBody.innerHTML = "";

    if (peleador.peleas && peleador.peleas.length > 0) {
        peleador.peleas.forEach(pelea => {
            const filaPelea = document.createElement('tr');
            filaPelea.innerHTML = `
                <td>${pelea.fecha}</td>
                <td>${pelea.evento}</td>
                <td>${pelea.oponente}</td>
                <td><strong>${pelea.resultado}</strong></td>
                <td>${pelea.metodo}</td>
                <td><a href="${pelea.video}" target="_blank" class="btn-video">Ver Pelea 📺</a></td>
            `;
            fightHistoryBody.appendChild(filaPelea);
        });
    } else {
        fightHistoryBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #888;">No hay combates registrados todavía.</td></tr>`;
    }
}

// 4. Volver al inicio desde el perfil
function volverAlInicio() {
    document.getElementById('profileView').style.display = 'none';

    const searchSection = document.getElementById('searchInput').parentElement;
    const fightersTable = document.querySelector('.fighters-table');
    const tituloDestacados = document.querySelectorAll('main h2')[0];
    const eventsSection = document.querySelector('.events-section');

    if (searchSection) searchSection.style.display = 'flex';
    if (fightersTable) fightersTable.style.display = 'table';
    if (tituloDestacados) tituloDestacados.style.display = 'block';
    if (eventsSection) eventsSection.style.display = 'block';
}

// 5. Búsqueda en tiempo real
const searchInput = document.getElementById('searchInput');

if (searchInput) {
    searchInput.addEventListener('input', function(e) {
        const textoBusqueda = e.target.value.toLowerCase();
        
        const peleadoresFiltrados = peleadores.filter(peleador => {
            return peleador.nombreReal.toLowerCase().includes(textoBusqueda) ||
                   peleador.alias.toLowerCase().includes(textoBusqueda) ||
                   peleador.pais.toLowerCase().includes(textoBusqueda);
        });

        cargarPeleadores(peleadoresFiltrados);
    });
}

// 6. Cuenta regresiva (Stream Fighters - 14 Nov 2026)
const eventoActivo = true; 
const nombreDelEvento = "Stream Fighters"; 
const fechaDelEvento = "2026-11-14T00:00:00";

function iniciarCuentaRegresiva() {
    const tituloElemento = document.getElementById('eventTitle');
    const timerElemento = document.getElementById('countdown');
    const mensajeElemento = document.getElementById('noEventMessage');

    if (!eventoActivo) {
        if (tituloElemento) tituloElemento.textContent = "⏳ Próximo Evento";
        if (timerElemento) timerElemento.style.display = 'none';
        if (mensajeElemento) mensajeElemento.style.display = 'block';
        return;
    }

    if (tituloElemento) tituloElemento.textContent = `⏳ Cuenta regresiva: ${nombreDelEvento}`;
    if (timerElemento) timerElemento.style.display = 'flex';
    if (mensajeElemento) mensajeElemento.style.display = 'none';

    const fechaEventoObj = new Date(fechaDelEvento).getTime();

    const actualizarReloj = setInterval(() => {
        const ahora = new Date().getTime();
        const diferencia = fechaEventoObj - ahora;

        if (diferencia <= 0) {
            clearInterval(actualizarReloj);
            if (timerElemento) timerElemento.innerHTML = "<span style='color: #28a745; font-size: 1rem;'>¡El evento ha comenzado!</span>";
            return;
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        const dSpan = document.getElementById('days');
        const hSpan = document.getElementById('hours');
        const mSpan = document.getElementById('minutes');
        const sSpan = document.getElementById('seconds');

        if (dSpan) dSpan.textContent = String(dias).padStart(2, '0');
        if (hSpan) hSpan.textContent = String(horas).padStart(2, '0');
        if (mSpan) mSpan.textContent = String(minutos).padStart(2, '0');
        if (sSpan) sSpan.textContent = String(segundos).padStart(2, '0');
    }, 1000);
}

iniciarCuentaRegresiva();