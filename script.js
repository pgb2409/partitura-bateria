window.onload = function () {
  const VF = Vex.Flow;
  const div = document.getElementById("partitura");

  // Crear el renderizador SVG
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(600, 200);
  const context = renderer.getContext();

  // Crear el pentagrama
  const stave = new VF.Stave(10, 40, 500);
  stave.addClef("percussion").setContext(context).draw();

  // Crear las notas de batería (4 golpes de caja)
  const notes = [
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
  ];

  // Crear la voz y formatear
  const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);

  // Guardar referencias SVG para sincronización
  window.notesSVG = div.querySelectorAll("svg .vf-note");
};

function reproducirAudio() {
  const fileInput = document.getElementById("audioInput");
  if (fileInput.files.length === 0) {
    alert("No se ha cargado ningún archivo de audio.");
    return;
  }

  const file = fileInput.files[0];
  const url = URL.createObjectURL(file);
  const audio = new Audio(url);
  audio.play();

  // Sincronización visual tipo karaoke (simulada)
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
  }, 500); // cada 500ms
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const svgElement = document.querySelector("#partitura svg");
  if (!svgElement) {
    alert("No se encontró la partitura SVG.");
    return;
  }

  // Convertir SVG a imagen PNG y añadir al PDF
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
