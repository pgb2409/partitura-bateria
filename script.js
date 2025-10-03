<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Partitura-Batería</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Partitura-Batería</h1>

  <!-- ✅ Este div es esencial para que se dibuje la partitura -->
  <div id="partitura"></div>

  <input type="file" id="audioInput" accept="audio/*" />
  <button onclick="reproducirAudio()">▶️ Reproducir</button>
  <button onclick="exportarPDF()">📄 Exportar a PDF</button>

  <script src="https://unpkg.com/vexflow/releases/vexflow-min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="script.js"></script>
</body>
</html>
