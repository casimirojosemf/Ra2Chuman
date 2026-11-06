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
