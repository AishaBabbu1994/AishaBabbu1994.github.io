let respuestasGuardadas = "";

// Configuración directa para evitar errores de carga local
const CONFIG = {
    api_url: "https://api.groq.com/openai/v1/chat/completions",
    model: "llama-3.3-70b-versatile"
};

document.getElementById('btnInvocar').addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const apiKey = document.getElementById('apiKey').value;
    const output = document.getElementById('output');
    const statusGif = document.getElementById('statusGif');

    if (!fileInput.files[0] || !apiKey) { 
        alert("¡Necesitas un pergamino (.txt) y tu llave API!"); 
        return; 
    }

    output.style.display = "block";
    statusGif.style.display = "block";
    output.innerText = "⏳ Preparando el ritual...";
    
    const reader = new FileReader();
    reader.onload = async (e) => {
        const contenido = e.target.result;
        
        try {
            const response = await fetch(CONFIG.api_url, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${apiKey}` 
                },
                body: JSON.stringify({
                    model: CONFIG.model,
                    messages:[{ 
                        role: "user", 
                        content: `Analiza este texto y genera 10 ejercicios de "ordenar palabras". 
                        Primero, lista los 10 ejercicios numerados (solo las palabras desordenadas). 
                        Después, escribe la sección "SOLUCIONES:" con las 10 frases originales ordenadas.
                        Texto: ${contenido}` 
                    }]
                })
            });

            const data = await response.json();
            
            // Verificamos si la respuesta contiene errores
            if (data.error) {
                throw new Error(data.error.message);
            }

            const textoCompleto = data.choices[0].message.content;
            const partes = textoCompleto.split(/SOLUCIONES:/i);
            
            output.innerText = "📜 EJERCICIOS SAGRADOS:\n\n" + (partes[0] || "No se generaron ejercicios.");
            respuestasGuardadas = partes[1] || "No se encontraron soluciones.";
            
            statusGif.style.display = "none";
            document.getElementById('btnVerRespuestas').style.display = "inline-block";
            
        } catch (err) { 
            statusGif.style.display = "none";
            output.innerText = "Error: " + err.message; 
            console.error(err);
        }
    };
    reader.readAsText(fileInput.files[0]);
});

document.getElementById('btnVerRespuestas').addEventListener('click', () => {
    const answerKey = document.getElementById('answerKey');
    answerKey.style.display = "block";
    document.getElementById('answerContent').innerHTML = "<strong>🔑 SOLUCIONES REVELADAS:</strong><br><br>" + respuestasGuardadas;
});