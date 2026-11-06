"use strict";

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

function cancelarEdicionPropietario() {
  propietarioEnEdicion = null;
  formularioPropietario.reset();
  document.getElementById("titulo-form-propietario").textContent = "Registrar propietario";
  document.getElementById("guardar-propietario").textContent = "Guardar propietario";
  document.getElementById("cancelar-edicion-propietario").classList.add("hidden");
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
