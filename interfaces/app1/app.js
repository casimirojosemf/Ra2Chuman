"use strict";

const propietarios = [];
const negocios = [];

let siguienteIdPropietario = 1;
let siguienteIdNegocio = 1;
let propietarioEnEdicion = null;
let negocioEnEdicion = null;

const formularioPropietario = document.getElementById("form-propietario");
const formularioNegocio = document.getElementById("form-negocio");
const entradaNombrePropietario = document.getElementById("nombre-propietario");
const entradaDniPropietario = document.getElementById("dni-propietario");
const entradaNombreNegocio = document.getElementById("nombre-negocio");
const entradaRubroNegocio = document.getElementById("rubro-negocio");
const entradaDireccionNegocio = document.getElementById("direccion-negocio");
const selectorPropietarioNegocio = document.getElementById("propietario-negocio");
const filtroPropietario = document.getElementById("filtrar-propietario");
const busquedaPropietario = document.getElementById("buscar-propietario");
const busquedaNegocio = document.getElementById("buscar-negocio");
const tablaPropietarios = document.getElementById("tabla-propietarios");
const tablaNegocios = document.getElementById("tabla-negocios");

function mostrarMensaje(elementId, mensaje, esError = false) {
  const elemento = document.getElementById(elementId);
  elemento.textContent = mensaje;
  elemento.classList.toggle("error", esError);
}

function agregarCelda(fila, contenido) {
  const celda = document.createElement("td");
  celda.textContent = contenido;
  fila.appendChild(celda);
  return celda;
}

function crearBotonAccion(texto, accion, id, clase = "button-secondary") {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = `button button-small ${clase}`;
  boton.textContent = texto;
  boton.dataset.action = accion;
  boton.dataset.id = id;
  return boton;
}

function renderizarPropietarios() {
  const consulta = busquedaPropietario.value.trim().toLocaleLowerCase();
  const resultados = propietarios.filter((propietario) =>
    propietario.nombre.toLocaleLowerCase().includes(consulta) ||
    propietario.dni.includes(consulta)
  );

  tablaPropietarios.replaceChildren();

  if (resultados.length === 0) {
    const fila = document.createElement("tr");
    fila.className = "empty-row";
    const celda = document.createElement("td");
    celda.colSpan = 4;
    celda.textContent = propietarios.length === 0
      ? "Aún no hay propietarios registrados."
      : "No se encontraron propietarios con esa búsqueda.";
    fila.appendChild(celda);
    tablaPropietarios.appendChild(fila);
    return;
  }

  resultados.forEach((propietario) => {
    const fila = document.createElement("tr");
    const cantidadNegocios = negocios.filter(
      (negocio) => negocio.idPropietario === propietario.idPropietario
    ).length;

    agregarCelda(fila, propietario.nombre);
    agregarCelda(fila, propietario.dni);
    agregarCelda(fila, String(cantidadNegocios));

    const acciones = document.createElement("td");
    acciones.className = "actions";
    acciones.append(
      crearBotonAccion("Ver negocios", "ver-negocios", propietario.idPropietario),
      crearBotonAccion("Editar", "editar-propietario", propietario.idPropietario),
      crearBotonAccion("Eliminar", "eliminar-propietario", propietario.idPropietario, "button-secondary button-danger")
    );
    fila.appendChild(acciones);
    tablaPropietarios.appendChild(fila);
  });
}

function actualizarSelectoresPropietario() {
  const valorSeleccionado = selectorPropietarioNegocio.value;
  const valorFiltrado = filtroPropietario.value;

  selectorPropietarioNegocio.replaceChildren();
  filtroPropietario.replaceChildren();

  const opcionInicial = document.createElement("option");
  opcionInicial.value = "";
  opcionInicial.textContent = "Selecciona un propietario";
  selectorPropietarioNegocio.appendChild(opcionInicial);

  const opcionTodos = document.createElement("option");
  opcionTodos.value = "";
  opcionTodos.textContent = "Todos los propietarios";
  filtroPropietario.appendChild(opcionTodos);

  propietarios.forEach((propietario) => {
    const opcionFormulario = document.createElement("option");
    opcionFormulario.value = String(propietario.idPropietario);
    opcionFormulario.textContent = `${propietario.nombre} (${propietario.dni})`;
    selectorPropietarioNegocio.appendChild(opcionFormulario);

    const opcionFiltro = document.createElement("option");
    opcionFiltro.value = String(propietario.idPropietario);
    opcionFiltro.textContent = `${propietario.nombre} (${propietario.dni})`;
    filtroPropietario.appendChild(opcionFiltro);
  });

  if (propietarios.some((propietario) => String(propietario.idPropietario) === valorSeleccionado)) {
    selectorPropietarioNegocio.value = valorSeleccionado;
  }
  if (propietarios.some((propietario) => String(propietario.idPropietario) === valorFiltrado)) {
    filtroPropietario.value = valorFiltrado;
  }
}

function renderizarNegocios() {
  const consulta = busquedaNegocio.value.trim().toLocaleLowerCase();
  const idPropietarioFiltrado = filtroPropietario.value;
  const resultados = negocios.filter((negocio) => {
    const coincideTexto =
      negocio.nombreNegocio.toLocaleLowerCase().includes(consulta) ||
      negocio.rubro.toLocaleLowerCase().includes(consulta);
    const coincidePropietario =
      idPropietarioFiltrado === "" ||
      String(negocio.idPropietario) === idPropietarioFiltrado;
    return coincideTexto && coincidePropietario;
  });

  tablaNegocios.replaceChildren();

  if (resultados.length === 0) {
    const fila = document.createElement("tr");
    fila.className = "empty-row";
    const celda = document.createElement("td");
    celda.colSpan = 5;
    celda.textContent = negocios.length === 0
      ? "Aún no hay negocios registrados."
      : "No se encontraron negocios con esos filtros.";
    fila.appendChild(celda);
    tablaNegocios.appendChild(fila);
    return;
  }

  resultados.forEach((negocio) => {
    const propietario = propietarios.find(
      (item) => item.idPropietario === negocio.idPropietario
    );
    const fila = document.createElement("tr");
    agregarCelda(fila, negocio.nombreNegocio);
    agregarCelda(fila, negocio.rubro);
    agregarCelda(fila, negocio.direccion);
    agregarCelda(fila, propietario ? propietario.nombre : "Propietario no encontrado");

    const acciones = document.createElement("td");
    acciones.className = "actions";
    acciones.append(
      crearBotonAccion("Editar", "editar-negocio", negocio.idNegocio),
      crearBotonAccion("Eliminar", "eliminar-negocio", negocio.idNegocio, "button-secondary button-danger")
    );
    fila.appendChild(acciones);
    tablaNegocios.appendChild(fila);
  });
}

function actualizarResumen() {
  document.getElementById("total-propietarios").textContent = String(propietarios.length);
  document.getElementById("total-negocios").textContent = String(negocios.length);
}

function renderizarAplicacion() {
  actualizarSelectoresPropietario();
  renderizarPropietarios();
  renderizarNegocios();
  actualizarResumen();
}

function cancelarEdicionPropietario() {
  propietarioEnEdicion = null;
  formularioPropietario.reset();
  document.getElementById("titulo-form-propietario").textContent = "Registrar propietario";
  document.getElementById("guardar-propietario").textContent = "Guardar propietario";
  document.getElementById("cancelar-edicion-propietario").classList.add("hidden");
}

function cancelarEdicionNegocio() {
  negocioEnEdicion = null;
  formularioNegocio.reset();
  document.getElementById("titulo-form-negocio").textContent = "Registrar negocio";
  document.getElementById("guardar-negocio").textContent = "Guardar negocio";
  document.getElementById("cancelar-edicion-negocio").classList.add("hidden");
}

function guardarPropietario(evento) {
  evento.preventDefault();
  mostrarMensaje("mensaje-propietario", "");

  const nombre = entradaNombrePropietario.value.trim();
  const dni = entradaDniPropietario.value.trim();

  if (!nombre || !dni) {
    mostrarMensaje("mensaje-propietario", "Completa todos los campos obligatorios.", true);
    return;
  }
  if (!/^\d{8}$/.test(dni)) {
    mostrarMensaje("mensaje-propietario", "El DNI debe contener exactamente 8 dígitos.", true);
    return;
  }

  const dniDuplicado = propietarios.some((propietario) =>
    propietario.dni === dni && propietario.idPropietario !== propietarioEnEdicion
  );
  if (dniDuplicado) {
    mostrarMensaje("mensaje-propietario", "Ya existe un propietario registrado con ese DNI.", true);
    return;
  }

  if (propietarioEnEdicion !== null) {
    const propietario = propietarios.find(
      (item) => item.idPropietario === propietarioEnEdicion
    );
    if (!propietario) {
      mostrarMensaje("mensaje-propietario", "No se encontró el propietario que intentas editar.", true);
      cancelarEdicionPropietario();
      return;
    }
    propietario.nombre = nombre;
    propietario.dni = dni;
    mostrarMensaje("mensaje-propietario", "Propietario actualizado correctamente.");
  } else {
    propietarios.push({
      idPropietario: siguienteIdPropietario++,
      nombre,
      dni
    });
    mostrarMensaje("mensaje-propietario", "Propietario registrado correctamente.");
  }

  cancelarEdicionPropietario();
  renderizarAplicacion();
}

function guardarNegocio(evento) {
  evento.preventDefault();
  mostrarMensaje("mensaje-negocio", "");

  const nombreNegocio = entradaNombreNegocio.value.trim();
  const rubro = entradaRubroNegocio.value.trim();
  const direccion = entradaDireccionNegocio.value.trim();
  const idPropietario = Number(selectorPropietarioNegocio.value);

  if (!nombreNegocio || !rubro || !direccion || !selectorPropietarioNegocio.value) {
    mostrarMensaje("mensaje-negocio", "Completa todos los campos y selecciona un propietario.", true);
    return;
  }
  if (!propietarios.some((propietario) => propietario.idPropietario === idPropietario)) {
    mostrarMensaje("mensaje-negocio", "Selecciona un propietario registrado.", true);
    return;
  }

  if (negocioEnEdicion !== null) {
    const negocio = negocios.find((item) => item.idNegocio === negocioEnEdicion);
    if (!negocio) {
      mostrarMensaje("mensaje-negocio", "No se encontró el negocio que intentas editar.", true);
      cancelarEdicionNegocio();
      return;
    }
    negocio.nombreNegocio = nombreNegocio;
    negocio.rubro = rubro;
    negocio.direccion = direccion;
    negocio.idPropietario = idPropietario;
    mostrarMensaje("mensaje-negocio", "Negocio actualizado correctamente.");
  } else {
    negocios.push({
      idNegocio: siguienteIdNegocio++,
      nombreNegocio,
      rubro,
      direccion,
      idPropietario
    });
    mostrarMensaje("mensaje-negocio", "Negocio registrado correctamente.");
  }

  cancelarEdicionNegocio();
  renderizarAplicacion();
}

function editarPropietario(id) {
  const propietario = propietarios.find((item) => item.idPropietario === id);
  if (!propietario) return;

  propietarioEnEdicion = id;
  entradaNombrePropietario.value = propietario.nombre;
  entradaDniPropietario.value = propietario.dni;
  document.getElementById("titulo-form-propietario").textContent = "Editar propietario";
  document.getElementById("guardar-propietario").textContent = "Guardar cambios";
  document.getElementById("cancelar-edicion-propietario").classList.remove("hidden");
  mostrarMensaje("mensaje-propietario", "Modifica los datos y guarda los cambios.");
  formularioPropietario.scrollIntoView({ behavior: "smooth", block: "center" });
}

function editarNegocio(id) {
  const negocio = negocios.find((item) => item.idNegocio === id);
  if (!negocio) return;

  negocioEnEdicion = id;
  entradaNombreNegocio.value = negocio.nombreNegocio;
  entradaRubroNegocio.value = negocio.rubro;
  entradaDireccionNegocio.value = negocio.direccion;
  selectorPropietarioNegocio.value = String(negocio.idPropietario);
  document.getElementById("titulo-form-negocio").textContent = "Editar negocio";
  document.getElementById("guardar-negocio").textContent = "Guardar cambios";
  document.getElementById("cancelar-edicion-negocio").classList.remove("hidden");
  mostrarMensaje("mensaje-negocio", "Modifica los datos y guarda los cambios.");
  formularioNegocio.scrollIntoView({ behavior: "smooth", block: "center" });
}

function gestionarAccionPropietario(evento) {
  const boton = evento.target.closest("button[data-action]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.action;

  if (accion === "editar-propietario") {
    editarPropietario(id);
  } else if (accion === "eliminar-propietario") {
    const propietario = propietarios.find((item) => item.idPropietario === id);
    if (!propietario) return;

    const negociosAsociados = negocios.filter((negocio) => negocio.idPropietario === id);
    if (negociosAsociados.length > 0) {
      mostrarMensaje(
        "mensaje-propietario",
        `No se puede eliminar a ${propietario.nombre}: tiene ${negociosAsociados.length} negocio(s) asociado(s).`,
        true
      );
      return;
    }
    if (!window.confirm(`¿Deseas eliminar al propietario ${propietario.nombre}?`)) return;

    propietarios.splice(propietarios.indexOf(propietario), 1);
    if (propietarioEnEdicion === id) cancelarEdicionPropietario();
    mostrarMensaje("mensaje-propietario", "Propietario eliminado correctamente.");
    renderizarAplicacion();
  } else if (accion === "ver-negocios") {
    filtroPropietario.value = String(id);
    busquedaNegocio.value = "";
    renderizarNegocios();
    document.getElementById("negocios").scrollIntoView({ behavior: "smooth" });
  }
}

function gestionarAccionNegocio(evento) {
  const boton = evento.target.closest("button[data-action]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  if (boton.dataset.action === "editar-negocio") {
    editarNegocio(id);
  } else if (boton.dataset.action === "eliminar-negocio") {
    const negocio = negocios.find((item) => item.idNegocio === id);
    if (!negocio || !window.confirm(`¿Deseas eliminar el negocio ${negocio.nombreNegocio}?`)) return;

    negocios.splice(negocios.indexOf(negocio), 1);
    if (negocioEnEdicion === id) cancelarEdicionNegocio();
    mostrarMensaje("mensaje-negocio", "Negocio eliminado correctamente.");
    renderizarAplicacion();
  }
}

formularioPropietario.addEventListener("submit", guardarPropietario);
formularioNegocio.addEventListener("submit", guardarNegocio);
tablaPropietarios.addEventListener("click", gestionarAccionPropietario);
tablaNegocios.addEventListener("click", gestionarAccionNegocio);
busquedaPropietario.addEventListener("input", renderizarPropietarios);
busquedaNegocio.addEventListener("input", renderizarNegocios);
filtroPropietario.addEventListener("change", renderizarNegocios);
document.getElementById("cancelar-edicion-propietario").addEventListener("click", () => {
  cancelarEdicionPropietario();
  mostrarMensaje("mensaje-propietario", "Edición cancelada.");
});
document.getElementById("cancelar-edicion-negocio").addEventListener("click", () => {
  cancelarEdicionNegocio();
  mostrarMensaje("mensaje-negocio", "Edición cancelada.");
});

renderizarAplicacion();
