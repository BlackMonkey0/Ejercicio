// =======================
// 📅 CALENDARIO
// =======================
const diasContainer = document.getElementById("dias");

if (diasContainer) {
  const detalleDia = document.getElementById("detalle-dia");
  const tituloDia = document.getElementById("titulo-dia");
  const comidasDiv = document.getElementById("comidas");
  const entrenoDiv = document.getElementById("entrenamiento");

  const fechaInicio = new Date("2025-08-01");
  const totalDias = 31;

  for (let i = 0; i < totalDias; i++) {
    const dia = new Date(fechaInicio);
    dia.setDate(dia.getDate() + i);

    const div = document.createElement("div");
    div.classList.add("dia");
    div.innerHTML = `<h3>${dia.toLocaleDateString()}</h3><p>Ver detalles</p>`;
    div.onclick = () => mostrarDia(dia);
    diasContainer.appendChild(div);
  }

  function mostrarDia(fecha) {
    const clave = fecha.toISOString().split("T")[0];
    const comidas = window.PLAN_COMIDAS?.[clave] || [];
    const entreno = window.RUTINAS?.[clave] || [];

    tituloDia.textContent = `Día: ${fecha.toLocaleDateString()}`;
    comidasDiv.innerHTML = "<h3>🍽️ Comidas</h3>";
    entrenoDiv.innerHTML = "<h3>💪 Entrenamiento</h3>";

    if (comidas.length === 0) {
      comidasDiv.innerHTML += "<p>No hay comidas registradas para este día.</p>";
    } else {
      comidas.forEach(c => {
        comidasDiv.innerHTML += `
          <div class="card">
            <h4>${c.nombre}</h4>
            <p>${c.descripcion}</p>
            <small>${c.calorias} kcal</small>
          </div>`;
      });
    }

    if (entreno.length === 0) {
      entrenoDiv.innerHTML += "<p>No hay entrenamiento registrado para este día.</p>";
    } else {
      entreno.forEach(e => {
        entrenoDiv.innerHTML += `
          <div class="card">
            <h4>${e.nombre}</h4>
            <p>${e.descripcion}</p>
          </div>`;
      });
    }

    detalleDia.classList.remove("hidden");
  }

  window.cerrarDetalle = function () {
    detalleDia.classList.add("hidden");
  };
}

// =======================
// 🏆 SISTEMA DE PUNTOS
// =======================
let puntos = parseInt(localStorage.getItem("puntos"), 10) || 0;
actualizarPuntos();

function sumarPuntos(cantidad) {
  puntos += cantidad;
  localStorage.setItem("puntos", puntos);
  actualizarPuntos();
}

function actualizarPuntos() {
  const puntosDiv = document.getElementById("barra-puntos");
  if (puntosDiv) {
    puntosDiv.innerHTML = `<strong>🏆 Puntos:</strong> ${puntos}`;
  }
}

// =======================
// ✏️ REGISTRO MANUAL DE DATOS
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const formManual = document.getElementById("form-manual");
  const listaManual = document.getElementById("listaManual");

  let registrosManuales = JSON.parse(localStorage.getItem("registrosManuales")) || [];
  renderizarLista();

  if (formManual) {
    formManual.addEventListener("submit", function (e) {
      e.preventDefault();

      const nombre = document.getElementById("nombreManual").value.trim();
      const cantidad = parseFloat(document.getElementById("cantidadManual").value);
      const calorias = parseFloat(document.getElementById("caloriasManual").value);
      const proteinas = parseFloat(document.getElementById("proteinasManual").value);
      const carbohidratos = parseFloat(document.getElementById("carbohidratosManual").value);
      const grasas = parseFloat(document.getElementById("grasasManual").value);

      if (!nombre || isNaN(cantidad) || isNaN(calorias)) {
        alert("Por favor, rellena todos los campos correctamente.");
        return;
      }

      const nuevoAlimento = {
        id: Date.now(),
        nombre,
        cantidad,
        calorias,
        proteinas: proteinas || 0,
        carbohidratos: carbohidratos || 0,
        grasas: grasas || 0,
        fecha: new Date().toLocaleDateString()
      };

      registrosManuales.push(nuevoAlimento);
      localStorage.setItem("registrosManuales", JSON.stringify(registrosManuales));
      renderizarLista();
      formManual.reset();
    });
  }

  function renderizarLista() {
    if (!listaManual) return;
    listaManual.innerHTML = "";

    if (registrosManuales.length === 0) {
      listaManual.innerHTML = "<li>No hay registros todavía.</li>";
      return;
    }

    registrosManuales.slice().reverse().forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.nombre}</strong> (${item.cantidad}g/ml) - 
        ${item.calorias} kcal | ${item.proteinas}g P | 
        ${item.carbohidratos}g C | ${item.grasas}g G 
        <span style="color:gray;">[${item.fecha}]</span>
      `;
      listaManual.appendChild(li);
    });
  }
});
