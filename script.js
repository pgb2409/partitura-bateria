const canvas = document.getElementById("partitura");
const ctx = canvas.getContext("2d");
const bpmSelector = document.getElementById("bpm");
const patternInput = document.getElementById("patternInput");
const playButton = document.getElementById("playButton");
const exportButton = document.getElementById("exportButton");
const saveButton = document.getElementById("savePattern");
const loadButton = document.getElementById("loadPattern");
const musicxmlInput = document.getElementById("musicxmlInput");

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
  const spacing = 10;
  const totalWidth = pattern.length * (notaWidth + spacing);
  canvas.width = totalWidth;
  canvas.height = 100;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  pattern.forEach((nota, i) => {
    ctx.fillStyle = notaColor[nota] || "#bdc3c7";
    ctx.fillRect(i * (notaWidth + spacing), 30, notaWidth, 40);
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

patternInput.addEventListener("change", () => {
  pattern = patternInput.value.split(",");
  dibujarPartitura();
});

playButton.addEventListener("click", reproducirPartitura);
exportButton.addEventListener("click", exportarPDF);
saveButton.addEventListener("click", guardarPatron);
loadButton.addEventListener("click", cargarPatron);

// NUEVO: Cargar y dibujar MusicXML
musicxmlInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const xmlText = e.target.result;
    parseMusicXML(xmlText);
  };
  reader.readAsText(file);
});

function parseMusicXML(xmlText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "application/xml");
  const notes = xmlDoc.getElementsByTagName("note");

  const VF = Vex.Flow;
  const renderer = new VF.Renderer(canvas, VF.Renderer.Backends.CANVAS);
  renderer.resize(1000, 200);
  const context = renderer.getContext();
  context.clearRect(0, 0, canvas.width, canvas.height);

  const stave = new VF.Stave(10, 40, 900);
  stave.addClef("percussion").setContext(context).draw();

  const vexNotes = [];

  for (let i = 0; i < notes.length && i < 16; i++) {
    const isRest = notes[i].getElementsByTagName("rest").length > 0;
    const step = notes[i].getElementsByTagName("step")[0]?.textContent || "C";
    const duration = notes[i].getElementsByTagName("type")[0]?.textContent || "8";

    const key = isRest ? "b/4" : `${step.toLowerCase()}/4`;
    const note = new VF.StaveNote({ clef: "percussion", keys: [key], duration: duration });

    if (isRest) note.addArticulation(0, new VF.Articulation("a@a").setPosition(3));
    vexNotes.push(note);
  }

  const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(vexNotes);

  const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 800);
  voice.draw(context, stave);
}

// Inicializar
dibujarPartitura();
