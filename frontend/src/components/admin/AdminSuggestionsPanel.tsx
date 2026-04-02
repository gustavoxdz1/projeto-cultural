import type { Suggestion } from '../../types/api';

type AdminSuggestionsPanelProps = {
  suggestions: Suggestion[];
  busySuggestionId: string | null;
  onSuggestionStatus: (id: string, status: 'APPROVED' | 'REJECTED') => void;
};

export function AdminSuggestionsPanel({
  suggestions,
  busySuggestionId,
  onSuggestionStatus,
}: AdminSuggestionsPanelProps) {
  return (
    <div className="admin-panel">
      <h2>Sugestões pendentes</h2>
      <div className="admin-feed">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <article className="suggestion-review-card" key={suggestion.id}>
              <div className="suggestion-review-header">
                <div>
                  <strong>{suggestion.name}</strong>
                  <p>{suggestion.categoryName}</p>
                </div>
                <div className="status-pill pending">PENDING</div>
              </div>

              <p>{suggestion.description || suggestion.address}</p>
              <small>
                {suggestion.neighborhood} · {suggestion.address}
              </small>
              <small>
                Coordenadas:{' '}
                {suggestion.latitude != null && suggestion.longitude != null
                  ? `${suggestion.latitude}, ${suggestion.longitude}`
                  : 'não informadas'}
              </small>

              <div className="suggestion-actions">
                <button
                  className="action-button approve"
                  disabled={busySuggestionId === suggestion.id}
                  onClick={() => onSuggestionStatus(suggestion.id, 'APPROVED')}
                  type="button"
                >
                  Aprovar
                </button>
                <button
                  className="action-button reject"
                  disabled={busySuggestionId === suggestion.id}
                  onClick={() => onSuggestionStatus(suggestion.id, 'REJECTED')}
                  type="button"
                >
                  Rejeitar
                </button>
              </div>
            </article>
          ))
        ) : (
          <p className="feedback">Nenhuma sugestão pendente no momento.</p>
        )}
      </div>
    </div>
  );
}
