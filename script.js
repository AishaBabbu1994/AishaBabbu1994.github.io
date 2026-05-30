let respuestasGuardadas = "";

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
    output.innerText = "⏳ Las ninfas están redactando los acertijos sagrados...";
    
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
                        content: `Eres un oráculo sabio. Analiza el siguiente texto y crea 10 ejercicios de "ordenar palabras" que sean educativos y claros.
                        
                        REGLAS ESTRICTAS DE FORMATO:
                        1. Genera 10 ejercicios numerados. Para cada ejercicio, presenta una frase del texto con las palabras mezcladas.
                        2. Después de los 10 ejercicios, escribe obligatoriamente la palabra "SOLUCIONES:" en una línea nueva.
                        3. Debajo de "SOLUCIONES:", lista las 10 frases originales correctamente ordenadas.
                        
                        Texto a analizar: ${contenido}` 
                    }]
                })
            });

            const data = await response.json();
            
            if (data.error) throw new Error(data.error.message);

            const textoCompleto = data.choices[0].message.content;
            
            // Separación más precisa buscando la palabra clave
            const partes = textoCompleto.split(/SOLUCIONES:/i);
            
            if (partes.length < 2) {
                // Si la IA no siguió el formato, mostramos todo el texto
                output.innerText = "📜 EJERCICIOS SAGRADOS:\n\n" + textoCompleto;
            } else {
                output.innerText = "📜 EJERCICIOS SAGRADOS:\n\n" + partes[0].trim();
                respuestasGuardadas = partes[1].trim();
            }
            
            statusGif.style.display = "none";
            document.getElementById('btnVerRespuestas').style.display = "inline-block";
            
        } catch (err) { 
            statusGif.style.display = "none";
            output.innerText = "Error del Oráculo: " + err.message; 
        }
    };
    reader.readAsText(fileInput.files[0]);
});

document.getElementById('btnVerRespuestas').addEventListener('click', () => {
    const answerKey = document.getElementById('answerKey');
    answerKey.style.display = "block";
    document.getElementById('answerContent').innerHTML = "<strong>🔑 SOLUCIONES REVELADAS:</strong><br><br>" + respuestasGuardadas;
});
