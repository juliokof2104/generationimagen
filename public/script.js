async function generarImagen() {
  const prompt = document.getElementById("prompt").value;
  const contenedor = document.getElementById("resultado");
  contenedor.innerHTML = "⌛ Generando imagen...";

  try {
   const response = await fetch("https://ghibli-api.onrender.com/api/generar", {
    const response = await fetch("/api/generar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data.image) {
      const imagen = document.createElement("img");
      imagen.src = data.image;
      imagen.alt = "Imagen generada";
      imagen.style.maxWidth = "100%";
      contenedor.innerHTML = ""; // limpiar mensaje anterior
      contenedor.appendChild(imagen);
    } else {
      contenedor.innerHTML = "⚠️ No se generó imagen.";
      console.error("Respuesta del servidor sin imagen:", data);
    }

  } catch (error) {
    contenedor.innerHTML = "❌ Hubo un error.";
    console.error("Error al generar imagen:", error);
  }
}

