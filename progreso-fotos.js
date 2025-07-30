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

  if (antes && despues) {
    document.getElementById("img-antes").src = antes;
    document.getElementById("img-despues").src = despues;
    document.getElementById("comparador").classList.remove("hidden");

    const slider = document.getElementById("sliderComparador");
    slider.addEventListener("input", () => {
      const valor = slider.value;
      document.getElementById("img-despues").style.clipPath = `inset(0 ${100 - valor}% 0 0)`;
    });
  }
}

// Ejecutar al cargar
window.addEventListener("load", cargarComparador);
