window.onload = function () {
  const VF = Vex.Flow;
  const div = document.getElementById("partitura");
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

  audio.oncanplaythrough = () => {
    audio.play();
    alert("Reproduciendo audio...");
  };

  audio.onerror = () => {
    alert("Error al reproducir el archivo. Asegúrate de que sea un formato compatible.");
  };
}
