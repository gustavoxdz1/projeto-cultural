import { useEffect, useState } from 'react';
import { createSuggestion, getCategories } from '../services/api';
import type { Category } from '../types/api';

export function SuggestionPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {
      setCategories([]);
    });
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      await createSuggestion({
        name: String(formData.get('name') ?? ''),
        description: String(formData.get('description') ?? ''),
        address: String(formData.get('address') ?? ''),
        neighborhood: String(formData.get('neighborhood') ?? ''),
        categoryName: String(formData.get('categoryName') ?? ''),
      });

      form.reset();
      setMessage('Sugestão enviada com sucesso. Ela ficará disponível para análise do administrador.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Não foi possível enviar a sugestão.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="form-page">
      <div className="form-intro">
        <span className="eyebrow">Colaboração</span>
        <h1>Ajude a revelar novos pontos de cultura da cidade.</h1>
        <p>Preencha apenas as informações essenciais. A equipe administrativa fará a validação antes da publicação oficial.</p>
        <p className="form-helper-text">
          Informe o nome do espaço, uma categoria aproximada e o endereço mais claro possível.
        </p>
      </div>

      <form className="card-form two-columns" onSubmit={handleSubmit} data-testid="suggestion-form">
        <label>
          Nome do local
          <input
            data-testid="suggestion-name"
            name="name"
            placeholder="Ex.: Centro Cultural Palácio Rio Negro"
            required
          />
          <small className="field-helper">Use o nome pelo qual o local é conhecido publicamente.</small>
        </label>

        <label>
          Categoria sugerida
          <input
            data-testid="suggestion-category"
            list="category-suggestions"
            name="categoryName"
            placeholder="Ex.: Cultura, Lazer, Esporte"
            required
          />
          <small className="field-helper">Você pode digitar livremente ou escolher uma sugestão existente.</small>
        </label>

        <label className="full-width">
          Endereço
          <input
            data-testid="suggestion-address"
            name="address"
            placeholder="Rua, avenida, ponto de referência ou complemento"
            required
          />
          <small className="field-helper">Quanto mais claro o endereço, mais fácil será validar e publicar.</small>
        </label>

        <label>
          Bairro
          <input
            data-testid="suggestion-neighborhood"
            name="neighborhood"
            placeholder="Ex.: Centro"
            required
          />
        </label>

        <label className="full-width">
          Descrição
          <textarea
            data-testid="suggestion-description"
            name="description"
            placeholder="Descreva brevemente o espaço, sua finalidade ou por que ele deve entrar no portal."
            rows={5}
          />
          <small className="field-helper">Esse campo é opcional, mas ajuda a qualificar melhor a análise.</small>
        </label>

        <datalist id="category-suggestions">
          {categories.map((category) => (
            <option key={category.id} value={category.name} />
          ))}
        </datalist>

        {message ? <p className="feedback success full-width" data-testid="suggestion-success">{message}</p> : null}
        {error ? <p className="feedback error full-width" data-testid="suggestion-error">{error}</p> : null}

        <button
          className="primary-button full-width"
          data-testid="suggestion-submit"
          disabled={loading}
          type="submit"
        >
          {loading ? 'Enviando...' : 'Enviar sugestão'}
        </button>
      </form>
    </section>
  );
}
