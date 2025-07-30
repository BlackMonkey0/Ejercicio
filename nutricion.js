// --- Gestión de pestañas ---
const tabs = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// --- Calculadora de macros ---
const formMacros = document.getElementById('formMacros');
const resultadoMacros = document.getElementById('resultadoMacros');

formMacros?.addEventListener('submit', e => {
  e.preventDefault();

  const pesoActual = parseFloat(document.getElementById('pesoActual').value);
  const objetivoSemanal = parseFloat(document.getElementById('objetivoSemanal').value);
  const fase = document.getElementById('fase').value;

  if (isNaN(pesoActual) || isNaN(objetivoSemanal)) {
    resultadoMacros.innerHTML = "<p style='color:red'>Por favor ingresa valores válidos.</p>";
    return;
  }

  const TMB = 10 * pesoActual + 6.25 * 175 - 5 * 26 + 5;
  const factorActividad = 1.3;
  let calorias = TMB * factorActividad;

  calorias += objetivoSemanal * 7700 / 7;

  let proteinas, carbohidratos, grasas;

  if (fase === 'volumen') {
    proteinas = pesoActual * 2.2;
    carbohidratos = (calorias * 0.55) / 4;
    grasas = (calorias * 0.25) / 9;
  } else {
    proteinas = pesoActual * 2.5;
    carbohidratos = (calorias * 0.40) / 4;
    grasas = (calorias * 0.30) / 9;
  }

  resultadoMacros.innerHTML = `
    <p>Calorías diarias objetivo: <strong>${Math.round(calorias)}</strong> kcal</p>
    <p>Proteínas: <strong>${proteinas.toFixed(1)} g</strong></p>
    <p>Carbohidratos: <strong>${carbohidratos.toFixed(1)} g</strong></p>
    <p>Grasas: <strong>${grasas.toFixed(1)} g</strong></p>
  `;
});

// --- Base de datos de alimentos (para simulación) ---
const baseDatosAlimentos = {
  "manzana": { calorias: 52, proteinas: 0.3, carbohidratos: 14, grasas: 0.2 },
  "plátano": { calorias: 89, proteinas: 1.1, carbohidratos: 23, grasas: 0.3 },
  "pollo": { calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6 },
  "arroz": { calorias: 130, proteinas: 2.7, carbohidratos: 28, grasas: 0.3 }
};

// --- Escáner por foto (simulado) ---
const fotoAlimento = document.getElementById('fotoAlimento');
const analizarFotoBtn = document.getElementById('analizarFoto');
const resultadoEscaner = document.getElementById('resultadoEscaner');

analizarFotoBtn?.addEventListener('click', () => {
  if (!fotoAlimento.files[0]) {
    resultadoEscaner.innerHTML = "<p style='color:red'>Por favor, selecciona una foto del alimento.</p>";
    return;
  }

  const keys = Object.keys(baseDatosAlimentos);
  const aleatorio = keys[Math.floor(Math.random() * keys.length)];
  const datos = baseDatosAlimentos[aleatorio];

  resultadoEscaner.innerHTML = `
    <h3>Alimento detectado: ${aleatorio}</h3>
    <p>Calorías: ${datos.calorias} kcal por 100g</p>
    <p>Proteínas: ${datos.proteinas} g</p>
    <p>Carbohidratos: ${datos.carbohidratos} g</p>
    <p>Grasas: ${datos.grasas} g</p>
    <button id="btnGuardar">Guardar en historial</button>
  `;

  document.getElementById('btnGuardar').onclick = () => {
    guardarHistorial({
      nombre: aleatorio,
      ...datos,
      fecha: new Date().toLocaleDateString()
    });
  };
});

// --- Registro por voz ---
const grabarAudio = document.getElementById("grabarAudio");
const resultadoRegistro = document.getElementById("resultadoRegistro");

grabarAudio?.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    resultadoRegistro.textContent = "Tu navegador no soporta reconocimiento de voz.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "es-ES";
  recognition.start();
  resultadoRegistro.textContent = "🎙️ Escuchando...";

  recognition.onresult = (event) => {
    const texto = event.results[0][0].transcript.toLowerCase();
    resultadoRegistro.innerHTML = `<strong>Texto reconocido:</strong> ${texto}<br><em>Analizando...</em>`;

    const alimentoDetectado = Object.keys(baseDatosAlimentos).find(key => texto.includes(key));
    if (alimentoDetectado) {
      const datos = baseDatosAlimentos[alimentoDetectado];
      resultadoRegistro.innerHTML += `
        <br><strong>🍽️ Alimento detectado:</strong> ${alimentoDetectado}
        <p>Calorías: ${datos.calorias} kcal</p>
        <p>Proteínas: ${datos.proteinas} g</p>
        <p>Carbohidratos: ${datos.carbohidratos} g</p>
        <p>Grasas: ${datos.grasas} g</p>
        <button id="btnGuardarVoz">Guardar en historial</button>
      `;

      document.getElementById('btnGuardarVoz').onclick = () => {
        guardarHistorial({
          nombre: alimentoDetectado,
          ...datos,
          fecha: new Date().toLocaleDateString()
        });
      };
    } else {
      resultadoRegistro.innerHTML += "<br><span style='color:red'>No se reconoció ningún alimento válido.</span>";
    }
  };

  recognition.onerror = () => {
    resultadoRegistro.textContent = "❌ Error al reconocer la voz.";
  };
});

// --- Guardar en historial ---
const listaHistorial = document.getElementById('listaHistorial');

function guardarHistorial(item) {
  const historial = JSON.parse(localStorage.getItem('historialComidas') || '[]');
  historial.push(item);
  localStorage.setItem('historialComidas', JSON.stringify(historial));
  mostrarHistorial();
}

function mostrarHistorial() {
  const historial = JSON.parse(localStorage.getItem('historialComidas') || '[]');
  if (historial.length === 0) {
    listaHistorial.innerHTML = "<li>No hay comidas guardadas.</li>";
    return;
  }

  listaHistorial.innerHTML = '';
  historial.forEach(item => {
    listaHistorial.innerHTML += `
      <li>
        <strong>${item.fecha}</strong> - ${item.nombre} 
        (Cal: ${item.calorias}, P: ${item.proteinas}g, C: ${item.carbohidratos}g, G: ${item.grasas}g)
      </li>
    `;
  });
}

mostrarHistorial();
