const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/"; // API de definições
const translateUrl = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q="; // API de tradução

function buscarPalavra(palavra = '') {
    const inputPalavra = palavra || document.getElementById("wordInput").value;

    // Primeira API - Definição da palavra
    fetch(`${apiUrl}${inputPalavra}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro na requisição de definição");
            }
            return response.json();
        })
        .then((data) => {
            const significado = data[0].meanings[0].definitions[0].definition;
            const exemploUso = data[0].meanings[0].definitions[0].example || "Nenhum exemplo de uso encontrado.";
            const categoriaGramatical = data[0].meanings[0].partOfSpeech || "Categoria gramatical não encontrada";
            const sinônimos = data[0].meanings[0].synonyms || [];
            const antônimos = data[0].meanings[0].antonyms || [];
            const fonetica = data[0].phonetic || "Transcrição fonética não disponível";

            // Segunda API - Tradução da palavra
            fetch(`${translateUrl}${encodeURIComponent(inputPalavra)}`)
                .then((response) => response.json())
                .then((data) => {
                    const traducao = data[0][0][0];
                    exibirResultado(inputPalavra, significado, exemploUso, traducao, sinônimos, antônimos, fonetica, categoriaGramatical);
                })
                .catch((error) => {
                    console.error("Erro ao traduzir:", error);
                    document.getElementById("resultContainer").innerHTML = "<p>Erro ao traduzir a palavra.</p>";
                });
        })
        .catch((error) => {
            console.error("Erro ao buscar dados de definição:", error);
            document.getElementById("resultContainer").innerHTML = "<p>Erro ao buscar dados de definição.<br>Verifique se a palavra esta correta e tente novamente.</p>";
        });
}

function exibirResultado(palavra, significado, exemploUso, traducao, sinônimos, antônimos, fonetica, categoriaGramatical) {
   
    const sinônimosLista = sinônimos.length > 0 ? sinônimos.join(', ') : "Nenhum sinônimo encontrado.";
    const antônimosLista = antônimos.length > 0 ? antônimos.join(', ') : "Nenhum antônimo encontrado.";

    const resultadoHTML = `
        <h2>Palavra: ${palavra}</h2>
        <p><strong>Tradução:</strong> ${traducao}</p>
        <p><strong>Significado:</strong> ${significado}</p>
        <p><strong>Exemplo de uso:</strong> ${exemploUso}</p>
        <p><strong>Categoria Gramatical:</strong> ${categoriaGramatical}</p>
        <p><strong>Sinônimos:</strong> ${sinônimosLista}</p>
        <p><strong>Antônimos:</strong> ${antônimosLista}</p>
        <p><strong>Transcrição Fonética:</strong> ${fonetica}</p>
    `;
    document.getElementById("resultContainer").innerHTML = resultadoHTML;
    document.getElementById("wordInput").value = ''; // Limpar o campo de input após a busca
}

// Para buscar ao pressionar Enter
document.getElementById("wordInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        buscarPalavra();
    }
});

// Adicionar palavras no Em Alta
const palavrasEmAlta = [
    "Resilience", "Empathy", "Sustainability", "Innovation", 
    "Mindfulness", "Diversity", "Authenticity", 
    "Empowerment", "Adaptability"
];

function criarPalavrasEmAlta() {
    const listUpContainer = document.querySelector('.list-up');
    
    palavrasEmAlta.forEach(palavra => {
        const button = document.createElement('button');
        button.textContent = palavra;
        button.onclick = () => buscarPalavra(palavra); 
        listUpContainer.appendChild(button);
    });
}

criarPalavrasEmAlta();

