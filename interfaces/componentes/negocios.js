"use strict";

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

function cancelarEdicionNegocio() {
  negocioEnEdicion = null;
  formularioNegocio.reset();
  document.getElementById("titulo-form-negocio").textContent = "Registrar negocio";
  document.getElementById("guardar-negocio").textContent = "Guardar negocio";
  document.getElementById("cancelar-edicion-negocio").classList.add("hidden");
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
