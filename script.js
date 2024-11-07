const apiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

function buscarPalavra() {
  const palavra = document.getElementById('wordInput').value;
  fetch(`${apiUrl}${palavra}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição');
      }
      return response.json();
    })
    .then(data => {
      const significado = data[0].meanings[0].definitions[0].definition;
      const exemploUso = data[0].meanings[0].definitions[0].example || 'Exemplo não disponível.';
      
      traduzirPalavra(palavra, significado, exemploUso);
    })
    .catch(error => {
      console.error('Erro ao buscar dados:', error);
      document.getElementById('resultContainer').innerHTML = '<p>Erro ao buscar dados. Tente novamente.</p>';
    });
}

function traduzirPalavra(palavra, significado, exemploUso) {
  const translateUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(palavra)}`;
  
  fetch(translateUrl)
    .then(response => response.json())
    .then(data => {
      const traducao = data[0][0][0];
      let resultadoHTML = `<h2>Tradução:</h2><p>${traducao}</p>`;
      resultadoHTML += `<h2>Significado:</h2><p>${significado}</p>`;
      resultadoHTML += `<h2>Exemplo de Uso:</h2><p>${exemploUso}</p>`;
      document.getElementById('resultContainer').innerHTML = resultadoHTML;
    })
    .catch(error => {
      console.error('Erro ao traduzir:', error);
      document.getElementById('resultContainer').innerHTML = '<p>Erro ao traduzir a palavra.</p>';
    });
}