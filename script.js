window.onload = function () {
  const VF = Vex.Flow;
  const div = document.getElementById("partitura");
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(600, 200);
  const context = renderer.getContext();
  const stave = new VF.Stave(10, 40, 500);
  stave.addClef("percussion").setContext(context).draw();

  // Crear notas
  const notes = [
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }),
  ];

  // Dibujar voz
  const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);

  // Guardar referencias para resaltar
  window.notesSVG = div.querySelectorAll("svg .vf-note");
};

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Partitura exportada", 10, 10);
  doc.save("partitura.pdf");
}

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
