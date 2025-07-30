document.addEventListener("DOMContentLoaded", () => {
  // === GRÁFICO ===
  const ctx = document.getElementById("graficoPeso").getContext("2d");
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5'],
      datasets: [
        { label: 'Peso (kg)', data: [55, 56, 57, 57.5, 58], borderColor: '#3b82f6', fill: false },
        { label: 'IMC', data: [18, 18.3, 18.6, 18.7, 19], borderColor: '#8b5cf6', fill: false },
        { label: 'Grasa Corporal (%)', data: [18, 17.5, 17.2, 17, 16.8], borderColor: '#ef4444', fill: false },
        { label: 'Masa Muscular (kg)', data: [30, 31, 32, 32.5, 33], borderColor: '#22c55e', fill: false },
        { label: 'Medidas Corporales (cm)', data: [110, 112, 114, 115, 116], borderColor: '#f59e0b', fill: false }
      ]
    },
    options: { responsive: true }
  });

  // === VOZ ===
  const grabarAudio = document.getElementById("grabarAudio");
  const subirFotoBtn = document.getElementById("subirFotoPlato");
  const inputFoto = document.getElementById("inputFotoPlato");
  const resultadoRegistro = document.getElementById("resultadoRegistro");

  grabarAudio?.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return resultadoRegistro.textContent = "❌ No soportado";
    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.start();
    resultadoRegistro.textContent = "🎙️ Escuchando...";
    recognition.onresult = e => resultadoRegistro.innerHTML = `<b>📝:</b> ${e.results[0][0].transcript}`;
    recognition.onerror = () => resultadoRegistro.textContent = "Error al reconocer voz.";
  });

  subirFotoBtn?.addEventListener("click", () => inputFoto.click());
  inputFoto?.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) resultadoRegistro.textContent = `📸 ${file.name}`;
  });

  // === COACH VIRTUAL ===
  const chatBox = document.getElementById("chat-box");
  const entradaChat = document.getElementById("entradaChat");
  const btnEnviar = document.getElementById("btnEnviarPregunta");

  const agregarMensaje = (tipo, texto) => {
    const div = document.createElement("div");
    div.classList.add("mensaje", tipo);
    div.textContent = texto;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  };

  const generarRespuestaIA = p => {
    p = p.toLowerCase();
    if (p.includes("desayuno")) return "Avena + plátano + proteína whey.";
    if (p.includes("piernas")) return "4x12 sentadillas + 3x15 zancadas.";
    if (p.includes("calorías")) return "Objetivo: 2800 kcal/día.";
    if (p.includes("creatina")) return "5g creatina post-entreno.";
    return "Estoy aprendiendo, pronto sabré más.";
  };

  const enviarPregunta = () => {
    const texto = entradaChat.value.trim();
    if (!texto) return;
    agregarMensaje("usuario", texto);
    entradaChat.value = "";
    setTimeout(() => agregarMensaje("ia", generarRespuestaIA(texto)), 800);
  };

  btnEnviar?.addEventListener("click", enviarPregunta);
  entradaChat?.addEventListener("keydown", e => e.key === "Enter" && enviarPregunta());
});
