/*
 * CreatorRing - Panel de administración
 * ------------------------------------
 * La página usa un cliente PÚBLICO de Supabase. La autorización de verdad
 * ocurre mediante RLS, no por ocultar los botones en este archivo.
 * Los campos 'EditId' guardan el id de la fila que estamos modificando.
 */

// Cache en memoria: se actualiza al guardar, editar o borrar.
const estado = { peleadores: [], combates: [], eventos: [] };
const $ = (id) => document.getElementById(id);

// Los mensajes siempre utilizan textContent, nunca HTML de la base de datos.
function avisar(id, texto, error = false) {
  const elemento = $(id);
  elemento.textContent = texto;
  elemento.classList.toggle("error", error);
  elemento.classList.toggle("ok", !error && !!texto);
}
function valor(id) {
  return $(id).value.trim();
}
function opcional(id) {
  return valor(id) || null;
}
function etiquetaPeleador(p) {
  return p?.alias || p?.nombre_real || "Sin nombre";
}
function etiquetaEvento(e) {
  return e?.nombre || e?.titulo || e?.name || `Evento #${e?.id}`;
}
function errorLegible(error) {
  console.error("Supabase:", error);
  if (error?.code === "23505")
    return "Ya existe un registro con ese valor único (por ejemplo, el slug).";
  if (error?.code === "23503")
    return "Este registro está relacionado con otros. Revisa los combates o eventos asociados.";
  if (
    error?.code === "42501" ||
    /row-level security|permission denied/i.test(error?.message || "")
  )
    return "Permiso denegado por Supabase (revisa la sesión y las políticas RLS).";
  return error?.message || "Error desconocido. Revisa la consola.";
}

// Tabulador: solo muestra una sección a la vez; no cambia permisos.
function mostrarPestana(nombre) {
  for (const clave of [
    "peleadores",
    "combates",
    "eventos",
    "proximosEventos",
  ]) {
    $(`seccion${clave[0].toUpperCase()}${clave.slice(1)}`).hidden =
      clave !== nombre;
  }
  document.querySelectorAll("[data-tab]").forEach((boton) => {
    boton.setAttribute("aria-pressed", String(boton.dataset.tab === nombre));
  });
}

// Una fila simple con nodos DOM: evita interpretar HTML que venga de Supabase.
function celda(texto) {
  const td = document.createElement("td");
  td.textContent = String(texto ?? "");
  return td;
}
function crearAcciones(registro, editar, borrar) {
  const td = document.createElement("td");
  const caja = document.createElement("div");
  caja.className = "table-buttons";
  const botonEditar = document.createElement("button");
  botonEditar.type = "button";
  botonEditar.className = "secondary";
  botonEditar.textContent = "Editar";
  botonEditar.addEventListener("click", () => editar(registro));
  const botonBorrar = document.createElement("button");
  botonBorrar.type = "button";
  botonBorrar.className = "danger";
  botonBorrar.textContent = "Eliminar";
  botonBorrar.addEventListener("click", () => borrar(registro));
  caja.append(botonEditar, botonBorrar);
  td.append(caja);
  return td;
}
function pintarTabla(id, filas, construirFila) {
  const tbody = $(id);
  tbody.replaceChildren();
  if (!filas.length) {
    const tr = document.createElement("tr");
    const td = celda("Todavía no hay registros.");
    td.colSpan = tbody.closest("table").querySelectorAll("th").length;
    td.className = "empty-row";
    tr.append(td);
    tbody.append(tr);
    return;
  }
  filas.forEach((registro) => tbody.append(construirFila(registro)));
}
function nuevaFila(valores, acciones) {
  const tr = document.createElement("tr");
  valores.forEach((v) => tr.append(celda(v)));
  tr.append(acciones);
  return tr;
}

// Consulta centralizada con respuesta uniforme {data,error} de supabase-js.
async function cargarTabla(tabla) {
  const { data, error } = await supabaseClient
    .from(tabla)
    .select("*")
    .order("id", { ascending: true });
  if (error) throw error;
  estado[tabla] = data || [];
}

// --- PELEADORES ---
function reiniciarPeleador() {
  $("formPeleador").reset();
  $("peleadorEditId").value = "";
  $("guardarPeleador").textContent = "💾 Guardar peleador";
  $("cancelarPeleador").hidden = true;
}
function editarPeleador(p) {
  mostrarPestana("peleadores");
  $("peleadorEditId").value = p.id;
  for (const [id, campo] of Object.entries({
    slug: "slug",
    nombre_real: "nombre_real",
    alias: "alias",
    pais: "pais",
    foto: "foto",
    record: "record",
    instagram: "instagram",
    tiktok: "tiktok",
    youtube: "youtube",
    twitter: "twitter",
  }))
    $(id).value = p[campo] || "";
  $("guardarPeleador").textContent = "💾 Actualizar peleador";
  $("cancelarPeleador").hidden = false;
  $("formPeleador").scrollIntoView({ behavior: "smooth", block: "start" });
}
function dibujarPeleadores() {
  pintarTabla("listaPeleadores", estado.peleadores, (p) =>
    nuevaFila(
      [p.id, etiquetaPeleador(p), p.slug, p.record || "0-0-0"],
      crearAcciones(p, editarPeleador, eliminarPeleador),
    ),
  );
}
async function guardarPeleador(evento) {
  evento.preventDefault();
  const editId = valor("peleadorEditId");
  const datos = {
    slug: valor("slug").toLowerCase(),
    nombre_real: opcional("nombre_real"),
    alias: opcional("alias"),
    pais: opcional("pais"),
    foto: opcional("foto"),
    record: opcional("record") || "0-0-0",
    instagram: opcional("instagram"),
    tiktok: opcional("tiktok"),
    youtube: opcional("youtube"),
    twitter: opcional("twitter"),
  };
  if (!datos.nombre_real && !datos.alias) {
    avisar(
      "mensajePeleador",
      "Escribe por lo menos un nombre real o un alias.",
      true,
    );
    return;
  }
  const boton = $("guardarPeleador");
  boton.disabled = true;
  avisar("mensajePeleador", "Guardando...");
  try {
    const consulta = editId
      ? supabaseClient.from("peleadores").update(datos).eq("id", Number(editId))
      : supabaseClient.from("peleadores").insert(datos);
    const { error } = await consulta;
    if (error) throw error;
    reiniciarPeleador();
    await recargarTodo();
    avisar(
      "mensajePeleador",
      editId ? "✅ Peleador actualizado." : "✅ Peleador registrado.",
    );
  } catch (error) {
    avisar("mensajePeleador", `❌ ${errorLegible(error)}`, true);
  } finally {
    boton.disabled = false;
  }
}
async function eliminarPeleador(p) {
  if (
    !confirm(
      `¿Eliminar a ${etiquetaPeleador(p)}? Sus combates asociados podrían impedirlo.`,
    )
  )
    return;
  try {
    const { error } = await supabaseClient
      .from("peleadores")
      .delete()
      .eq("id", p.id);
    if (error) throw error;
    await recargarTodo();
    avisar("mensajePeleador", "✅ Peleador eliminado de Supabase.");
  } catch (error) {
    avisar("mensajePeleador", `❌ ${errorLegible(error)}`, true);
  }
}

// --- COMBATES ---
function reiniciarCombate() {
  $("formCombate").reset();
  $("combateEditId").value = "";
  $("guardarCombate").textContent = "💾 Guardar combate";
  $("cancelarCombate").hidden = true;
}
function editarCombate(c) {
  mostrarPestana("combates");
  $("combateEditId").value = c.id;
  $("combatePeleador").value = c.peleador_id ?? "";
  $("combateEvento").value = c.evento_id ?? "";
  $("combateOponente").value = c.oponente || "";
  $("combateResultado").value = c.resultado || "";
  $("combateMetodo").value = c.metodo || "";
  $("combateFecha").value = c.fecha || "";
  $("combateVideo").value = c.video || "";
  $("guardarCombate").textContent = "💾 Actualizar combate";
  $("cancelarCombate").hidden = false;
  $("formCombate").scrollIntoView({ behavior: "smooth", block: "start" });
}
function dibujarCombates() {
  const nombres = new Map(
    estado.peleadores.map((p) => [String(p.id), etiquetaPeleador(p)]),
  );
  pintarTabla("listaCombates", estado.combates, (c) =>
    nuevaFila(
      [
        c.id,
        nombres.get(String(c.peleador_id)) || `ID ${c.peleador_id}`,
        c.oponente,
        c.fecha || "Sin fecha",
        c.resultado,
      ],
      crearAcciones(c, editarCombate, eliminarCombate),
    ),
  );
}
// FECHA AUTOMÁTICA SEGÚN EL EVENTO
// Cuando seleccionamos un evento, buscamos su fecha
// entre los eventos que ya cargamos desde Supabase.

document.getElementById("combateEvento").addEventListener("change", (event) => {
  const eventoId = event.target.value;
  const campoFecha = document.getElementById("combateFecha");

  // Si no seleccionamos ningún evento, no cambiamos la fecha.
  if (!eventoId) return;

  // Buscamos el evento seleccionado por su ID.
  const eventoSeleccionado = estado.eventos.find(
    (evento) => String(evento.id) === String(eventoId),
  );

  // Si el evento tiene fecha, la colocamos automáticamente.
  if (eventoSeleccionado?.fecha) {
    campoFecha.value = eventoSeleccionado.fecha;
  }
});

async function guardarCombate(evento) {
  evento.preventDefault();
  const editId = valor("combateEditId");
  const datos = {
    peleador_id: Number(valor("combatePeleador")),
    evento_id: valor("combateEvento") ? Number(valor("combateEvento")) : null,
    oponente: valor("combateOponente"),
    resultado: valor("combateResultado"),
    metodo: opcional("combateMetodo"),
    fecha: opcional("combateFecha"),
    video: opcional("combateVideo"),
  };
  if (!datos.peleador_id || !datos.oponente || !datos.resultado) {
    avisar("mensajeCombate", "Selecciona peleador, rival y resultado.", true);
    return;
  }
  const boton = $("guardarCombate");
  boton.disabled = true;
  avisar("mensajeCombate", "Guardando...");
  try {
    const consulta = editId
      ? supabaseClient.from("combates").update(datos).eq("id", Number(editId))
      : supabaseClient.from("combates").insert(datos);
    const { error } = await consulta;
    if (error) throw error;
    reiniciarCombate();
    await recargarTodo();
    avisar(
      "mensajeCombate",
      editId ? "✅ Combate actualizado." : "✅ Combate registrado.",
    );
  } catch (error) {
    avisar("mensajeCombate", `❌ ${errorLegible(error)}`, true);
  } finally {
    boton.disabled = false;
  }
}
async function eliminarCombate(c) {
  if (
    !confirm(
      `¿Eliminar la pelea contra ${c.oponente}? Esta acción no se puede deshacer.`,
    )
  )
    return;
  try {
    const { error } = await supabaseClient
      .from("combates")
      .delete()
      .eq("id", c.id);
    if (error) throw error;
    await recargarTodo();
    avisar("mensajeCombate", "✅ Combate eliminado.");
  } catch (error) {
    avisar("mensajeCombate", `❌ ${errorLegible(error)}`, true);
  }
}

// --- EVENTOS ---
// Las columnas nombre, fecha, organizador, lugar y descripcion se garantizan
// únicamente DESPUÉS de ejecutar sql/01_eventos_campos.sql en Supabase.
function reiniciarEvento() {
  $("formEvento").reset();
  $("eventoEditId").value = "";
  $("guardarEvento").textContent = "💾 Guardar evento";
  $("cancelarEvento").hidden = true;
}
function editarEvento(e) {
  mostrarPestana("eventos");
  $("eventoEditId").value = e.id;
  $("eventoNombre").value = e.nombre || "";
  $("eventoFecha").value = e.fecha || "";
  $("eventoOrganizador").value = e.organizador || "";
  $("eventoLugar").value = e.lugar || "";
  $("eventoDescripcion").value = e.descripcion || "";
  $("guardarEvento").textContent = "💾 Actualizar evento";
  $("cancelarEvento").hidden = false;
  $("formEvento").scrollIntoView({ behavior: "smooth", block: "start" });
}
function dibujarEventos() {
  pintarTabla("listaEventos", estado.eventos, (e) =>
    nuevaFila(
      [e.id, etiquetaEvento(e), e.fecha || "Sin fecha"],
      crearAcciones(e, editarEvento, eliminarEvento),
    ),
  );
}
async function guardarEvento(evento) {
  evento.preventDefault();
  const editId = valor("eventoEditId");
  const datos = {
    nombre: valor("eventoNombre"),
    fecha: opcional("eventoFecha"),
    organizador: opcional("eventoOrganizador"),
    lugar: opcional("eventoLugar"),
    descripcion: opcional("eventoDescripcion"),
  };
  if (!datos.nombre) {
    avisar("mensajeEvento", "Escribe el nombre del evento.", true);
    return;
  }
  const boton = $("guardarEvento");
  boton.disabled = true;
  avisar("mensajeEvento", "Guardando...");
  try {
    const consulta = editId
      ? supabaseClient.from("eventos").update(datos).eq("id", Number(editId))
      : supabaseClient.from("eventos").insert(datos);
    const { error } = await consulta;
    if (error) throw error;
    reiniciarEvento();
    await recargarTodo();
    avisar(
      "mensajeEvento",
      editId ? "✅ Evento actualizado." : "✅ Evento registrado.",
    );
  } catch (error) {
    avisar(
      "mensajeEvento",
      `❌ ${errorLegible(error)} Revisa sql/01_eventos_campos.sql si faltan columnas.`,
      true,
    );
  } finally {
    boton.disabled = false;
  }
}
async function eliminarEvento(e) {
  if (
    !confirm(
      `¿Eliminar el evento ${etiquetaEvento(e)}? Si tiene combates asociados puede fallar.`,
    )
  )
    return;
  try {
    const { error } = await supabaseClient
      .from("eventos")
      .delete()
      .eq("id", e.id);
    if (error) throw error;
    await recargarTodo();
    avisar("mensajeEvento", "✅ Evento eliminado.");
  } catch (error) {
    avisar("mensajeEvento", `❌ ${errorLegible(error)}`, true);
  }
}

// Sincroniza todos los listados y los dos selectores relacionados.
function rellenarSelector(id, registros, describir, placeholder) {
  const select = $(id);
  const anterior = select.value;
  select.replaceChildren();
  const vacio = document.createElement("option");
  vacio.value = "";
  vacio.textContent = placeholder;
  select.append(vacio);
  registros.forEach((registro) => {
    const opcion = document.createElement("option");
    opcion.value = String(registro.id);
    opcion.textContent = describir(registro);
    select.append(opcion);
  });
  if ([...select.options].some((op) => op.value === anterior))
    select.value = anterior;
}
function dibujarProximosEventos() {
  const tbody = $("listaProximosEventos");
  tbody.replaceChildren();

  // Obtenemos la fecha de hoy en formato local.
  const hoy = new Date();
  const fechaHoy = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0"),
  ].join("-");

  // Filtramos los eventos de hoy y los futuros.
  const proximos = estado.eventos
    .filter(
      (evento) =>
        evento.fecha &&
        /^\d{4}-\d{2}-\d{2}$/.test(evento.fecha) &&
        evento.fecha >= fechaHoy,
    )
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  if (proximos.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");

    celda.colSpan = 4;
    celda.textContent = "No hay próximos eventos registrados.";

    fila.appendChild(celda);
    tbody.appendChild(fila);
    return;
  }

  proximos.forEach((evento) => {
    const fila = document.createElement("tr");

    fila.appendChild(celda(evento.nombre || "Sin nombre"));
    fila.appendChild(celda(evento.fecha));
    fila.appendChild(celda(evento.organizador || "No registrado"));
    fila.appendChild(celda(evento.lugar || "No registrado"));

    tbody.appendChild(fila);
  });
}

async function recargarTodo() {
  // Esperamos secuencialmente para que una tabla con fallo no oculte las otras.
  for (const tabla of ["peleadores", "eventos", "combates"]) {
    try {
      await cargarTabla(tabla);
    } catch (error) {
      console.error(`Error cargando ${tabla}:`, error);
      const mensajeId = {
        peleadores: "mensajePeleador",
        eventos: "mensajeEvento",
        combates: "mensajeCombate",
      }[tabla];
      avisar(
        mensajeId,
        `❌ No se pudo cargar ${tabla}: ${errorLegible(error)}`,
        true,
      );
    }
  }
  rellenarSelector(
    "combatePeleador",
    estado.peleadores,
    etiquetaPeleador,
    "Selecciona un peleador",
  );
  rellenarSelector(
    "combateEvento",
    estado.eventos,
    etiquetaEvento,
    "Sin evento asignado",
  );
  dibujarPeleadores();
  dibujarEventos();
  dibujarCombates();
  dibujarProximosEventos();
}

// La autenticación se hace ANTES de mostrar el panel y traer los datos.
async function verificarAcceso() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();
    if (error || !data?.user) {
      window.location.replace("login.html");
      return;
    }
    const { data: esAdmin, error: adminError } =
      await supabaseClient.rpc("es_administrador");
    if (adminError || esAdmin !== true) {
      avisar(
        "mensaje",
        "Acceso denegado: el usuario no es administrador.",
        true,
      );
      return;
    }
    $("panel").hidden = false;
    $("cerrarSesion").hidden = false;
    $("mensaje").hidden = true;
    mostrarPestana("peleadores");
    await recargarTodo();
  } catch (error) {
    avisar("mensaje", `Error de conexión: ${errorLegible(error)}`, true);
  }
}

// Eventos conectados después de cargar el HTML.
document
  .querySelectorAll("[data-tab]")
  .forEach((boton) =>
    boton.addEventListener("click", () => mostrarPestana(boton.dataset.tab)),
  );
$("formPeleador").addEventListener("submit", guardarPeleador);
$("formCombate").addEventListener("submit", guardarCombate);
$("formEvento").addEventListener("submit", guardarEvento);
$("cancelarPeleador").addEventListener("click", reiniciarPeleador);
$("cancelarCombate").addEventListener("click", reiniciarCombate);
$("cancelarEvento").addEventListener("click", reiniciarEvento);
$("cerrarSesion").addEventListener("click", async () => {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    avisar("mensaje", `No se pudo cerrar sesión: ${errorLegible(error)}`, true);
    $("mensaje").hidden = false;
    return;
  }
  $("panel").hidden = true;
  window.location.replace("login.html");
});
verificarAcceso();
