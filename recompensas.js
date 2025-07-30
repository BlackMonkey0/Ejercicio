const recompensas = [
  { nombre: "Receta secreta: Gainer casero", costo: 50 },
  { nombre: "Rutina fuerza avanzada", costo: 100 },
  { nombre: "Smoothie energético +500 kcal", costo: 75 },
  { nombre: "Tip de recuperación muscular", costo: 30 }
];

function mostrarRecompensas() {
  const div = document.getElementById("lista-recompensas");
  div.innerHTML = "<h3>🎁 Recompensas desbloqueables</h3>";

  recompensas.forEach((r, i) => {
    const btn = document.createElement("button");
    btn.textContent = `Desbloquear (${r.costo} pts)`;
    btn.onclick = () => desbloquear(i);
    btn.disabled = puntos < r.costo;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h4>${r.nombre}</h4>`;
    card.appendChild(btn);
    div.appendChild(card);
  });
}

function desbloquear(index) {
  if (puntos >= recompensas[index].costo) {
    puntos -= recompensas[index].costo;
    localStorage.setItem('puntos', puntos);
    alert(`¡Has desbloqueado: ${recompensas[index].nombre}!`);
    actualizarPuntos();
    mostrarRecompensas();
  }
}

window.addEventListener("DOMContentLoaded", mostrarRecompensas);
