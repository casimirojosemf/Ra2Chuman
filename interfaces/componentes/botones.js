"use strict";

function crearBotonAccion(texto, accion, id, clase = "button-secondary") {
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = `button button-small ${clase}`;
  boton.textContent = texto;
  boton.dataset.action = accion;
  boton.dataset.id = id;
  return boton;
}
