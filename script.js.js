let audio = null;

function reproducirAudio() {
  const input = document.getElementById('audioInput');
  if (input.files.length === 0) {
    alert('Selecciona un archivo de audio primero.');
    return;
  }

  const file = input.files[0];
  const url = URL.createObjectURL(file);

  if (audio) {
    audio.pause();
    audio = null;
  }

  audio = new Audio(url);
  audio.play();
}

function cargarMusicXML() {
  const input = document.getElementById('musicxmlInput');
  if (input.files.length === 0) {
    alert('Selecciona un archivo MusicXML.');
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const xml = e.target.result;
    mostrarPartitura(xml);
  };

  reader.readAsText(file);
}

function mostrarPartitura(xmlText) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = '16px Segoe UI';
  ctx.fillStyle = '#2c3e50';
  ctx.fillText('Partitura cargada desde MusicXML:', 20, 40);

  // Simulación visual básica
  const lineas = xmlText.split('\n').slice(0, 10);
  lineas.forEach((linea, i) => {
    ctx.fillText(linea.trim(), 20, 70 + i * 20);
  });
}
