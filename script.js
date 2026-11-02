/*
 * CREATORRING | Catálogo público (sin credenciales privadas).
 * Flujo: mostrar catálogo local -> consultar eventos/combates/peleadores ->
 * fusionar los registros por slug -> actualizar la interfaz.
 * Las reglas de acceso reales viven en las políticas RLS de Supabase.
 */

// Avatar original del proyecto. Se muestra si una foto no existe o falla.
const FOTO_PREDETERMINADA =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";

// Los datos de peleadores.js se conservan como catálogo de respaldo.
// Un registro en Supabase con el mismo slug tiene prioridad sobre el local.
let peleadores = [...listaPeleadoresOficial];
let peleadoresSupabase = [];
let combatesSupabase = [];
let eventosSupabase = [];
let perfilActual = null;

// Escapa solo por texto: no construimos HTML con datos introducidos por usuarios.
function crearElemento(etiqueta, texto = "", clase = "") {
  const elemento = document.createElement(etiqueta);
  elemento.textContent = String(texto ?? "");
  if (clase) elemento.className = clase;
  return elemento;
}

// Permite exclusivamente enlaces HTTP y HTTPS, para evitar javascript: y similares.
function enlaceSeguro(valor) {
  if (typeof valor !== "string" || !valor.trim() || valor.trim() === "#") return "";
  try {
    const url = new URL(valor.trim());
    return ["https:", "http:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function nombrePeleador(p) {
  return p.nombreReal || p.alias || "Sin nombre";
}

function nombreEvento(e) {
  return e.nombre || e.titulo || e.name || `Evento #${e.id}`;
}

// ISO (2026-10-20) se formatea sin desfase UTC del navegador.
function fechaLegible(fecha) {
  if (!fecha) return "Sin fecha";
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    const [a, m, d] = fecha.split("-");
    return `${d}/${m}/${a}`;
  }
  return fecha;
}

// Convierte una pelea antigua o reciente a una misma estructura de presentación.
function normalizarCombate(combate, porIdEvento) {
  const evento = porIdEvento.get(String(combate.evento_id));
  return {
    fecha: fechaLegible(combate.fecha),
    evento: evento ? nombreEvento(evento) : "Sin evento",
    oponente: combate.oponente || "Sin oponente",
    resultado: combate.resultado || "Sin resultado",
    metodo: combate.metodo || "Sin método",
    video: combate.video || "",
  };
}

// Consulta pública: si falla la red, se preservan los registros originales.
async function obtenerEventosSupabase() {
  const { data, error } = await supabaseClient.from("eventos").select("*");
  if (error) {
    console.warn("No se pudieron cargar eventos. Se mantiene el listado local.", error);
    return;
  }
  eventosSupabase = data || [];
  pintarEventos();
  configurarCuentaRegresiva();
}

async function obtenerCombatesSupabase() {
  const { data, error } = await supabaseClient
    .from("combates")
    .select("*")
    .order("fecha", { ascending: false });
  if (error) {
    console.warn("No se pudieron cargar los combates de Supabase.", error);
    return;
  }
  combatesSupabase = data || [];
}

async function obtenerPeleadoresSupabase() {
  const { data, error } = await supabaseClient
    .from("peleadores")
    .select("*")
    .order("id", { ascending: true });
  if (error) {
    console.warn("No se pudieron cargar peleadores; se muestra el catálogo local.", error);
    return;
  }

  const eventosPorId = new Map(eventosSupabase.map((evento) => [String(evento.id), evento]));
  peleadoresSupabase = (data || []).map((p) => ({
    id: p.slug,
    supabaseId: p.id,
    nombreReal: p.nombre_real || "",
    alias: p.alias || "",
    pais: p.pais || "",
    foto: p.foto || "",
    record: p.record || "0-0-0",
    redes: {
      instagram: p.instagram || "",
      tiktok: p.tiktok || "",
      youtube: p.youtube || "",
      twitter: p.twitter || "",
    },
    peleas: combatesSupabase
      .filter((combate) => String(combate.peleador_id) === String(p.id))
      .map((combate) => normalizarCombate(combate, eventosPorId)),
  }));

  // "Map" previene duplicados: Supabase sustituye la ficha del mismo slug.
  const porSlug = new Map(listaPeleadoresOficial.map((p) => [String(p.id), p]));
  peleadoresSupabase.forEach((p) => porSlug.set(String(p.id), p));
  peleadores = [...porSlug.values()];
  filtrarPeleadores();

  // Si se está viendo una ficha durante la actualización, la renovamos.
  if (perfilActual) verPerfil(perfilActual);
}

// Crea filas con textContent (no se ejecuta HTML alojado en la base de datos).
function cargarPeleadores(listaAImprimir) {
  const tbody = document.getElementById("fightersTableBody");
  if (!tbody) return;
  tbody.replaceChildren();
  if (!listaAImprimir.length) {
    const fila = document.createElement("tr");
    const celda = crearElemento("td", "No encontramos peleadores con esa búsqueda.");
    celda.colSpan = 4;
    fila.append(celda);
    tbody.append(fila);
    return;
  }
  listaAImprimir.forEach((p) => {
    const fila = document.createElement("tr");
    const datos = document.createElement("td");
    datos.append(crearElemento("strong", nombrePeleador(p)));
    if (p.alias && p.alias !== p.nombreReal) {
      datos.append(document.createElement("br"), crearElemento("small", p.alias));
    }
    fila.append(datos, crearElemento("td", p.record || "0-0-0"), crearElemento("td", p.pais || "N/D"));
    const accion = document.createElement("td");
    const boton = crearElemento("button", "Ver ficha");
    boton.type = "button";
    boton.addEventListener("click", () => verPerfil(p.id));
    accion.append(boton);
    fila.append(accion);
    tbody.append(fila);
  });
}

function filtrarPeleadores() {
  const termino = (document.getElementById("searchInput")?.value || "").trim().toLocaleLowerCase("es");
  const resultados = peleadores.filter((p) =>
    [p.nombreReal, p.alias, p.pais].some((valor) => String(valor || "").toLocaleLowerCase("es").includes(termino)),
  );
  cargarPeleadores(resultados);
}

// Alterna vistas sin depender de posiciones de etiquetas <h2> o tablas.
function cambiarVista(mostrarPerfil) {
  document.getElementById("profileView").hidden = !mostrarPerfil;
  for (const id of ["searchSection", "eventsSection", "rosterTitle", "rosterTableWrapper"]) {
    document.getElementById(id).hidden = mostrarPerfil;
  }
}

function verPerfil(peleadorId) {
  const p = peleadores.find((item) => String(item.id) === String(peleadorId));
  if (!p) return;
  perfilActual = p.id;
  cambiarVista(true);
  const titulo = p.alias && p.alias !== p.nombreReal
    ? `${nombrePeleador(p)} (${p.alias})`
    : nombrePeleador(p);
  document.getElementById("profileName").textContent = titulo;
  document.getElementById("profileDetails").textContent =
    `Récord: ${p.record || "0-0-0"} | País: ${p.pais || "N/D"}`;

  const foto = document.getElementById("profilePhoto");
  foto.onerror = () => {
    foto.onerror = null; // Evita un ciclo si también falla la imagen predeterminada.
    foto.src = FOTO_PREDETERMINADA;
  };
  foto.src = enlaceSeguro(p.foto) || FOTO_PREDETERMINADA;
  foto.alt = `Foto de ${nombrePeleador(p)}`;

  const redes = document.getElementById("profileSocials");
  redes.replaceChildren();
  // Acepta tanto los perfiles antiguos (redes) como los importados (campos planos).
  for (const [clave, etiqueta] of [
    ["instagram", "Instagram"], ["tiktok", "TikTok"],
    ["youtube", "YouTube"], ["twitter", "Twitter / X"],
  ]) {
    const url = enlaceSeguro(p.redes?.[clave] || p[clave]);
    if (!url) continue;
    const a = crearElemento("a", etiqueta, "social-link");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    redes.append(a);
  }
  renderizarHistorialPeleas(p);
}

function renderizarHistorialPeleas(peleador) {
  const tbody = document.getElementById("fightHistoryBody");
  tbody.replaceChildren();
  const peleas = peleador.peleas || [];
  if (!peleas.length) {
    const fila = document.createElement("tr");
    const celda = crearElemento("td", "No hay combates registrados todavía.", "empty-state");
    celda.colSpan = 6;
    fila.append(celda);
    tbody.append(fila);
    return;
  }
  peleas.forEach((pelea) => {
    const fila = document.createElement("tr");
    fila.append(
      crearElemento("td", pelea.fecha || "Sin fecha"),
      crearElemento("td", pelea.evento || "Sin evento"),
      crearElemento("td", pelea.oponente || "N/D"),
      crearElemento("td", pelea.resultado || "N/D"),
      crearElemento("td", pelea.metodo || "N/D"),
    );
    const celdaVideo = document.createElement("td");
    const url = enlaceSeguro(pelea.video);
    if (url) {
      const enlace = crearElemento("a", "Ver pelea 📺", "btn-video");
      enlace.href = url;
      enlace.target = "_blank";
      enlace.rel = "noopener noreferrer";
      celdaVideo.append(enlace);
    } else {
      celdaVideo.textContent = "Sin video";
    }
    fila.append(celdaVideo);
    tbody.append(fila);
  });
}

// Funciones globales que mantiene el HTML del botón 'Volver'.
function volverAlInicio() {
  perfilActual = null;
  cambiarVista(false);
  filtrarPeleadores();
}

// Reemplaza tarjetas fijas únicamente cuando hay eventos reales de Supabase.
function pintarEventos() {
  const grid = document.getElementById("eventsGrid");
  if (!grid || !eventosSupabase.length) return;
  grid.replaceChildren();
  [...eventosSupabase]
    .sort((a, b) => String(b.fecha || "").localeCompare(String(a.fecha || "")))
    .forEach((evento) => {
      const tarjeta = document.createElement("article");
      tarjeta.className = "event-card";
      tarjeta.append(crearElemento("h3", nombreEvento(evento)));
      if (evento.fecha) tarjeta.append(crearElemento("p", `📅 ${fechaLegible(evento.fecha)}`));
      if (evento.organizador) tarjeta.append(crearElemento("p", `Organizador: ${evento.organizador}`));
      if (evento.lugar) tarjeta.append(crearElemento("p", `Lugar: ${evento.lugar}`));
      if (evento.descripcion) tarjeta.append(crearElemento("p", evento.descripcion));
      grid.append(tarjeta);
    });
}

let intervaloCuentaRegresiva = null;
function configurarCuentaRegresiva() {
  if (intervaloCuentaRegresiva) clearInterval(intervaloCuentaRegresiva);
  const titulo = document.getElementById("eventTitle");
  const reloj = document.getElementById("countdown");
  const mensaje = document.getElementById("noEventMessage");

  // Solo eventos con fecha futura: no inventamos el horario de un combate.
  // Por ello el contador toma la medianoche LOCAL de la fecha del evento.
  const ahora = Date.now();
  const futuros = eventosSupabase
    .filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.fecha || ""))
    .map((e) => ({ ...e, ms: new Date(`${e.fecha}T00:00:00`).getTime() }))
    .filter((e) => e.ms > ahora)
    .sort((a, b) => a.ms - b.ms);
  const siguiente = futuros[0];
  if (!siguiente) {
    titulo.textContent = "⏳ Próximo evento";
    reloj.hidden = true;
    mensaje.hidden = false;
    return;
  }
  titulo.textContent = `⏳ Cuenta regresiva: ${nombreEvento(siguiente)}`;
  reloj.hidden = false;
  mensaje.hidden = true;
  function actualizar() {
    const diferencia = siguiente.ms - Date.now();
    if (diferencia <= 0) {
      clearInterval(intervaloCuentaRegresiva);
      configurarCuentaRegresiva();
      return;
    }
    const partes = [
      Math.floor(diferencia / 86400000),
      Math.floor((diferencia % 86400000) / 3600000),
      Math.floor((diferencia % 3600000) / 60000),
      Math.floor((diferencia % 60000) / 1000),
    ];
    ["days", "hours", "minutes", "seconds"].forEach((id, i) => {
      document.getElementById(id).textContent = String(partes[i]).padStart(2, "0");
    });
  }
  actualizar();
  intervaloCuentaRegresiva = setInterval(actualizar, 1000);
}

// Orquesta las consultas en orden: un combate necesita su evento y su peleador.
async function iniciarCreatorRing() {
  filtrarPeleadores(); // El catálogo local se muestra incluso sin conexión.
  configurarCuentaRegresiva();
  document.getElementById("searchInput")?.addEventListener("input", filtrarPeleadores);
  if (typeof supabaseClient === "undefined") {
    console.warn("Supabase no está disponible. Se muestra únicamente el catálogo local.");
    return;
  }
  await obtenerEventosSupabase();
  await obtenerCombatesSupabase();
  await obtenerPeleadoresSupabase();
}

// ¡No olvidar invocar la función! En el ZIP inicial faltaba esta llamada.
iniciarCreatorRing();
