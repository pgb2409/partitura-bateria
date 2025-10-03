window.onload = function () {
  const VF = Vex.Flow;
  const div = document.getElementById("partitura");
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
  renderer.resize(600, 200);
  const context = renderer.getContext();
  const stave = new VF.Stave(10, 40, 500);
  stave.addClef("percussion").setContext(context).draw();

  const notes = [
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }).addArticulation(0, new VF.Articulation("a>").setPosition(3)),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }).addArticulation(0, new VF.Articulation("a>").setPosition(3)),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }).addArticulation(0, new VF.Articulation("a>").setPosition(3)),
    new VF.StaveNote({ keys: ["c/5"], duration: "q", clef: "percussion" }).addArticulation(0, new VF.Articulation("a>").setPosition(3)),
  ];

  const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
  voice.addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);
};
