function subirFoto(event, tipo) {
  const archivo = event.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function (e) {
    localStorage.setItem(`foto-${tipo}`, e.target.result);
    cargarComparador();
  };
  lector.readAsDataURL(archivo);
}

function cargarComparador() {
  const antes = localStorage.getItem("foto-antes");
  const despues = localStorage.getItem("foto-despues");

  const imgAntes = document.getElementById("img-antes");
  const imgDespues = document.getElementById("img-despues");
  const comparador = document.getElementById("comparador");
  const slider = document.getElementById("sliderComparador");

  if (antes && despues && imgAntes && imgDespues && comparador && slider) {
    imgAntes.src = antes;
    imgDespues.src = despues;
    comparador.classList.remove("hidden");

    // Eliminar listeners previos
    slider.oninput = null;
    slider.addEventListener("input", () => {
      const valor = slider.value;
      imgDespues.style.clipPath = `inset(0 ${100 - valor}% 0 0)`;
    });
    // Inicializar posición del slider con efecto
    imgDespues.style.clipPath = `inset(0 ${100 - slider.value}% 0 0)`;
  }
}

// Ejecutar al cargar
window.addEventListener("load", cargarComparador);
