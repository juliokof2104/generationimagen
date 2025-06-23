// script.js mejorado con galeria y descarga

const imagenesGeneradas = [];

async function generarImagen() {
  const prompt = document.getElementById("prompt").value;
  const contenedor = document.getElementById("resultado");
  const galeria = document.getElementById("galeria");

  contenedor.innerHTML = "⌛ Generando imagen...";

  try {
    const response = await fetch("/api/generar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data.image) {
      // Mostrar imagen principal
      const imagen = document.createElement("img");
      imagen.src = data.image;
      imagen.alt = "Imagen generada";
      imagen.style.maxWidth = "100%";

      // Botón de descarga
      const botonDescarga = document.createElement("a");
      botonDescarga.href = data.image;
      botonDescarga.download = "imagen-ia.png";
      botonDescarga.innerText = "💾 Descargar imagen";
      botonDescarga.className = "descargar";

      contenedor.innerHTML = "";
      contenedor.appendChild(imagen);
      contenedor.appendChild(botonDescarga);

      // Agregar a la galeria
      imagenesGeneradas.unshift(data.image); // nueva primero
      if (imagenesGeneradas.length > 9) imagenesGeneradas.pop();

      galeria.innerHTML = "";
      imagenesGeneradas.forEach(img => {
        const miniatura = document.createElement("img");
        miniatura.src = img;
        miniatura.alt = "Imagen generada";
        miniatura.className = "miniatura";
        galeria.appendChild(miniatura);
      });
    } else {
      contenedor.innerHTML = "⚠️ No se generó imagen.";
      console.error("Respuesta del servidor sin imagen:", data);
    }
  } catch (error) {
    contenedor.innerHTML = "❌ Hubo un error.";
    console.error("Error al generar imagen:", error);
  }
}

