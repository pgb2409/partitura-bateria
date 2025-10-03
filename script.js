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

  <div id="partitura"></div>

  <input type="file" id="audioInput" accept="audio/*" />
  <button onclick="reproducirAudio()">▶️ Reproducir</button>
  <button onclick="exportarPDF()">📄 Exportar a PDF</button>

  <!-- ✅ Primero se cargan las librerías -->
  <script src="https://unpkg.com/vexflow/releases/vexflow-min.js">
