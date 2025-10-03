window.onload = function () {
  dibujarPartituraBasica();
};

function dibujarPartituraBasica() {
  const VF = Vex.Flow;
  const div = document.getElementById("partitura");
  div.innerHTML = "";

  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(600, 200);
  const context = renderer.getContext();
  const stave = new VF.Stave(10, 40, 500);
  stave.addClef("percussion").setContext(context).draw();

  const notes = [
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
  ];

  const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);

  window.notesSVG = div.querySelectorAll("svg .vf-note");
  window.patronActual = ["c/5", "c/5", "c/5", "c/5"];
}

function cargarPatronPersonalizado() {
  const VF = Vex.Flow;
  const div = document.getElementById("partitura");
  div.innerHTML = "";

  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(1600, 200); // espacio para partitura larga
  const context = renderer.getContext();

  const stave = new VF.Stave(10, 40, 1550);
  stave.addClef("percussion").setContext(context).draw();

  // Crear patrón largo: 32 notas (8 compases)
  const notas = [];
  for (let i = 0; i < 32; i++) {
    const tipo = i % 4;
    if (tipo === 0) notas.push("f/4");      // bombo
    else if (tipo === 1) notas.push("c/5"); // caja
    else if (tipo === 2) notas.push("g/5"); // hi-hat
    else notas.push("c/5");                 // caja
  }

  const notes = notas.map(n => new VF.StaveNote({ keys: [n], duration: "8", clef: "percussion" }));

  const voice = new VF.Voice({ num_beats: 16, beat_value: 8 });
  voice.addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], 1500);
  voice.draw(context, stave);

  window.notesSVG = div.querySelectorAll("svg .vf-note");
  window.patronActual = notas;
}

function guardarPatron() {
  const nombre = prompt("Nombre del patrón:");
  if (nombre && window.patronActual) {
    localStorage.setItem("patron_" + nombre, JSON.stringify(window.patronActual));
    alert("Patrón guardado como: " + nombre);
  }
}

function cargarPatronGuardado() {
  const nombre = prompt("Nombre del patrón a cargar:");
  const datos = localStorage.getItem("patron_" + nombre);
  if (!datos) {
    alert("No se encontró ningún patrón con ese nombre.");
    return;
  }

  const VF = Vex.Flow;
  const div = document.getElementById("partitura");
  div.innerHTML = "";

  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(1600, 200);
  const context = renderer.getContext();
  const stave = new VF.Stave(10, 40, 1550);
  stave.addClef("percussion").setContext(context).draw();

  const notas = JSON.parse(datos);
  const notes = notas.map(n => new VF.StaveNote({ keys: [n], duration: "8", clef: "percussion" }));

  const voice = new VF.Voice({ num_beats: notas.length / 2, beat_value: 8 });
  voice.addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], 1500);
  voice.draw(context, stave);

  window.notesSVG = div.querySelectorAll("svg .vf-note");
  window.patronActual = notas;
}

function reproducirAudio() {
  const fileInput = document.getElementById("audioInput");
  if (fileInput.files.length === 0) {
    alert("No se ha cargado ningún archivo de audio.");
    return;
  }

  const bpm = parseInt(document.getElementById("bpmInput").value) || 120;
  const intervaloMs = 60000 / bpm;

  const file = fileInput.files[0];
  const url = URL.createObjectURL(file);
  const audio = new Audio(url);
  audio.play();

  let i = 0;
  const notas = window.notesSVG;
  const intervalo = setInterval(() => {
    if (i > 0) notas[i - 1].style.fill = "black";
    if (i < notas.length) {
      notas[i].style.fill = "red";
      i++;
    } else {
      clearInterval(intervalo);
    }
  }, intervaloMs);
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const svgElement = document.querySelector("#partitura svg");
  if (!svgElement) {
    alert("No se encontró la partitura SVG.");
    return;
  }

  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  const svgData = new XMLSerializer().serializeToString(svgElement);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    const imgData = canvas.toDataURL("image/png");
    doc.addImage(imgData, "PNG", 10, 10, 180, 60);
    doc.save("partitura.pdf");
  };

  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
}
