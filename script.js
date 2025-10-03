const canvas = document.getElementById("partitura");
const ctx = canvas.getContext("2d");
const bpmSelector = document.getElementById("bpm");
const patternInput = document.getElementById("patternInput");
const playButton = document.getElementById("playButton");
const exportButton = document.getElementById("exportButton");
const saveButton = document.getElementById("savePattern");
const loadButton = document.getElementById("loadPattern");

let pattern = [
  "bombo", "caja", "hihat", "bombo", "caja", "hihat", "bombo", "caja",
  "hihat", "bombo", "caja", "hihat", "bombo", "caja", "hihat", "bombo",
  "caja", "hihat", "bombo", "caja", "hihat", "bombo", "caja", "hihat",
  "bombo", "caja", "hihat", "bombo", "caja", "hihat", "bombo", "caja"
];

const notaColor = {
  bombo: "#3498db",
  caja: "#e74c3c",
  hihat: "#2ecc71"
};

function dibujarPartitura() {
  const notaWidth = 40;
  const notaHeight = 40;
  const spacing = 10;
  const totalWidth = pattern.length * (notaWidth + spacing);
  canvas.width = totalWidth;
  canvas.height = 100;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pattern.forEach((nota, i) => {
    ctx.fillStyle = notaColor[nota] || "#bdc3c7";
    ctx.fillRect(i * (notaWidth + spacing), 30, notaWidth, notaHeight);
    ctx.fillStyle = "#000";
    ctx.fillText(nota, i * (notaWidth + spacing) + 5, 25);
  });
}

function reproducirPartitura() {
  let bpm = parseInt(bpmSelector.value);
  let intervalo = 60000 / bpm;
  let i = 0;

  const intervalId = setInterval(() => {
    dibujarPartitura();
    ctx.strokeStyle = "#f1c40f";
    ctx.lineWidth = 3;
    const notaWidth = 40;
    const spacing = 10;
    ctx.strokeRect(i * (notaWidth + spacing), 30, notaWidth, 40);
    i++;
    if (i >= pattern.length) clearInterval(intervalId);
  }, intervalo);
}

function exportarPDF() {
  const pdfCanvas = document.createElement("canvas");
  pdfCanvas.width = canvas.width;
  pdfCanvas.height = canvas.height;
  const pdfCtx = pdfCanvas.getContext("2d");
  pdfCtx.drawImage(canvas, 0, 0);
  const imgData = pdfCanvas.toDataURL("image/png");

  const pdfWindow = window.open("");
  pdfWindow.document.write(`<img src="${imgData}" />`);
}

function guardarPatron() {
  localStorage.setItem("patronGuardado", JSON.stringify(pattern));
}

function cargarPatron() {
  const guardado = localStorage.getItem("patronGuardado");
  if (guardado) {
    pattern = JSON.parse(guardado);
    dibujarPartitura();
  }
}

playButton.addEventListener("click", reproducirPartitura);
exportButton.addEventListener("click", exportarPDF);
saveButton.addEventListener("click", guardarPatron);
loadButton.addEventListener("click", cargarPatron);
patternInput.addEventListener("change", () => {
  pattern = patternInput.value.split(",");
  dibujarPartitura();
});

dibujarPartitura();
