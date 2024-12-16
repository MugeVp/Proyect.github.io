let datos = [];

function agregarFila() {
    let nombre = document.getElementById('nombre').value;
    let numero = parseFloat(document.getElementById('numero').value);

    if (nombre && !isNaN(numero)) {
        datos.push({ nombre, numero });
        actualizarTabla();
        actualizarTotal();
        document.getElementById('nombre').value = '';
        document.getElementById('numero').value = '';
    } else {
        alert("Por favor, ingresa dato y un costo válido.");
    }
}

function actualizarTabla() {
    const tabla = document.getElementById('tabla').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';

    datos.forEach((dato) => {
        const fila = tabla.insertRow();
        const celdaNombre = fila.insertCell(0);
        const celdaNumero = fila.insertCell(1);

        celdaNombre.textContent = dato.nombre;
        celdaNumero.textContent = dato.numero;
    });
}

function actualizarTotal() {
    const total = datos.reduce((sum, dato) => sum + dato.numero, 0);
    document.getElementById('total').textContent = total;
}

function genPDF() {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    
    // Estilo general
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Texto negro

    // Título del PDF
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    const title = "Reporte de Datos";
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, margin + 15); // Centrado

    let startY = margin + 30;

    // Establecer color de fondo para la cabecera de la tabla
    doc.setFillColor(76, 175, 80);  // Verde
    doc.rect(margin, startY, pageWidth - 2 * margin, 10, 'F');  // Dibujar un rectángulo verde para la cabecera

    // Establecer estilo para los textos de la cabecera
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);  // Blanco para el texto
    doc.text("Nombre", margin + 5, startY + 7);
    doc.text("Número", pageWidth - margin - 30, startY + 7, { align: "right" });

    startY += 15;  // Espaciado entre la cabecera y las filas

    // Añadir las filas de datos
    doc.setTextColor(0, 0, 0);  // Texto en negro
    const cellWidth = (pageWidth - 2 * margin) / 2; // Ancho de cada celda

    // Dibujar filas con bordes
    datos.forEach((dato, index) => {
        const rowY = startY + (index * 10);

        // Dibujar celdas de la tabla
        doc.rect(margin, rowY, cellWidth, 10); // Celda "Nombre"
        doc.rect(margin + cellWidth, rowY, cellWidth, 10); // Celda "Número"
        
        // Escribir texto en las celdas
        doc.text(dato.nombre, margin + 5, rowY + 7);
        doc.text(dato.numero.toString(), margin + cellWidth + 5, rowY + 7, { align: "right" });
    });

    // Línea para separar la tabla de los datos finales
    startY += (datos.length * 10) + 10;
    doc.setLineWidth(0.5);
    doc.line(margin, startY, pageWidth - margin, startY);

    // Total
    startY += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total: " + document.getElementById('total').textContent, margin + 5, startY);

    // Crear un borde para todo el contenido
    const contentHeight = startY + 15; // Altura total del contenido con total
    doc.setDrawColor(0, 0, 0); // Color de borde negro
    doc.setLineWidth(1);
    doc.rect(margin - 5, margin - 5, pageWidth - 2 * margin + 10, contentHeight - margin + 10);  // Dibujar un borde alrededor de todo

    // Guardar el PDF con el nombre
    doc.save('Reporte_Datos.pdf');
}
