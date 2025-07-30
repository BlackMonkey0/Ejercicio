// Peso
const ctxPeso = document.getElementById('graficoPeso');
if (ctxPeso) {
  new Chart(ctxPeso.getContext('2d'), {
    type: 'line',
    data: {
      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
      datasets: [{
        label: 'Peso (kg)',
        data: [55, 58, 62, 65],
        borderColor: '#ffa726',
        fill: false
      }]
    }
  });
}

// Fuerza
const ctxFuerza = document.getElementById('graficoFuerza');
if (ctxFuerza) {
  new Chart(ctxFuerza.getContext('2d'), {
    type: 'bar',
    data: {
      labels: ['Press Banca', 'Sentadilla', 'Peso Muerto'],
      datasets: [{
        label: 'Fuerza (kg)',
        data: [60, 80, 90],
        backgroundColor: '#42a5f5'
      }]
    }
  });
}

// IMC
function calcularIMC(peso, altura) {
  return (peso / (altura * altura)).toFixed(2);
}
const pesoActual = 50; // Cambia por tu dato real
const altura = 1.70;   // Cambia por tu dato real en metros
document.getElementById('cuadroIMC').innerHTML =
  `<strong>IMC actual:</strong> ${calcularIMC(pesoActual, altura)}`;
