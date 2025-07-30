// Verifica que los elementos existen antes de usarlos
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

  window.mostrarDia = function(fecha) {
    const clave = fecha.toISOString().split("T")[0];
    const comidas = typeof PLAN_COMIDAS !== "undefined" ? (PLAN_COMIDAS[clave] || []) : [];
    const entreno = typeof RUTINAS !== "undefined" ? (RUTINAS[clave] || []) : [];

    tituloDia.textContent = `Día: ${fecha.toLocaleDateString()}`;
    comidasDiv.innerHTML = "<h3>🍽️ Comidas</h3>";
    entrenoDiv.innerHTML = "<h3>💪 Entrenamiento</h3>";

    comidas.forEach(c => {
      comidasDiv.innerHTML += `
        <div class="card">
          <h4>${c.nombre}</h4>
          <p>${c.descripcion}</p>
          <small>${c.calorias} kcal</small>
        </div>`;
    });

    entreno.forEach(e => {
      entrenoDiv.innerHTML += `
        <div class="card">
          <h4>${e.nombre}</h4>
          <p>${e.descripcion}</p>
        </div>`;
    });

    detalleDia.classList.remove("hidden");
  };

  window.cerrarDetalle = function() {
    detalleDia.classList.add("hidden");
  };
}

// SISTEMA DE PUNTOS
let puntos = parseInt(localStorage.getItem('puntos')) || 0;
actualizarPuntos();

function sumarPuntos(cantidad) {
  puntos += cantidad;
  localStorage.setItem('puntos', puntos);
  actualizarPuntos();
}

function actualizarPuntos() {
  const puntosDiv = document.getElementById("barra-puntos");
  if (puntosDiv) {
    puntosDiv.innerHTML = `<strong>Puntos:</strong> ${puntos}`;
  }
}

// CHAT IA (solo una versión, sin duplicados)
document.addEventListener("DOMContentLoaded", () => {
  const btnEnviar = document.getElementById("btnEnviarPregunta");
  const entradaChat = document.getElementById("entradaChat");
  const chatBox = document.getElementById("chat-box");

  if (btnEnviar && entradaChat && chatBox) {
    btnEnviar.addEventListener("click", enviarPregunta);
    entradaChat.addEventListener("keydown", function(e) {
      if (e.key === "Enter") enviarPregunta();
    });
  }

  function enviarPregunta() {
    const texto = entradaChat.value.trim();
    if (!texto) return;
    agregarMensaje("usuario", texto);
    entradaChat.value = "";

    setTimeout(() => {
      const respuesta = generarRespuestaIA(texto.toLowerCase());
      agregarMensaje("ia", respuesta);
      chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
  }

  function agregarMensaje(tipo, texto) {
    const div = document.createElement("div");
    div.classList.add("mensaje", tipo);
    div.textContent = texto;
    chatBox.appendChild(div);
  }

  function generarRespuestaIA(pregunta) {
    if (pregunta.includes("desayuno")) return "Un buen desayuno podría ser avena con plátano y proteína whey.";
    if (pregunta.includes("piernas")) return "Hoy toca pierna: 4x12 sentadillas + 3x15 zancadas.";
    if (pregunta.includes("calorías")) return "Tu objetivo diario es de unas 2800 kcal. Ajusta según tu actividad.";
    if (pregunta.includes("creatina")) return "Toma 5g diarios de creatina después de entrenar.";
    if (pregunta.includes("suplementos")) return "Los más recomendados: proteína whey, creatina, omega 3 y magnesio.";
    return "¡Buena pregunta! Estoy aprendiendo. Pronto podré darte respuestas más personalizadas.";
  }
});

// Clase hidden en CSS:
// .hidden { display: none !important; }
