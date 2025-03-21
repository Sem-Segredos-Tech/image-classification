<script>
  let selectedFile = null;
  let imagePreview = null;
  let loading = false;
  let error = null;
  let predictions = null;

  async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error = 'Por favor, selecione uma imagem válida';
      return;
    }

    selectedFile = file;
    error = null;
    predictions = null;

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!imagePreview) {
      error = 'Por favor, selecione uma imagem primeiro';
      return;
    }

    loading = true;
    error = null;

    try {
      const response = await fetch('http://localhost:5001/classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imagePreview
        })
      });

      if (!response.ok) {
        throw new Error('Falha ao classificar a imagem');
      }

      const data = await response.json();
      predictions = data.predictions;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
</script>

<main>
  <h1>Classificador de Imagens</h1>

  <div class="upload-container">
    <input
      type="file"
      accept="image/*"
      on:change={handleFileSelect}
      class="file-input"
    />

    {#if imagePreview}
      <div class="preview-container">
        <img src={imagePreview} alt="Preview" class="image-preview" />
        <button on:click={handleSubmit} disabled={loading}>
          {loading ? 'Classificando...' : 'Classificar Imagem'}
        </button>
      </div>
    {/if}

    {#if error}
      <div class="error">{error}</div>
    {/if}

    {#if predictions}
      <div class="predictions">
        <h2>Resultados:</h2>
        <ul>
          {#each predictions as prediction}
            <li>
              <span class="label">{prediction.label}:</span>
              <span class="confidence">{(prediction.confidence * 100).toFixed(2)}%</span>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }

  h1 {
    color: #333;
    margin-bottom: 2rem;
  }

  .upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .file-input {
    margin-bottom: 1rem;
  }

  .preview-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  .image-preview {
    max-width: 100%;
    max-height: 400px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  button {
    background-color: #4CAF50;
    color: white;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #45a049;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .error {
    color: #ff4444;
    margin-top: 1rem;
  }

  .predictions {
    margin-top: 2rem;
    padding: 1rem;
    border-radius: 8px;
    background-color: #f5f5f5;
    width: 100%;
    max-width: 400px;
  }

  .predictions h2 {
    color: #333;
    margin-bottom: 1rem;
  }

  .predictions ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .predictions li {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
  }

  .predictions li:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: bold;
    color: #333;
  }

  .confidence {
    color: #4CAF50;
  }
</style>
