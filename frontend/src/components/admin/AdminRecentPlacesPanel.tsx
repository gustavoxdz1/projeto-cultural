import type { Place } from '../../types/api';

type AdminRecentPlacesPanelProps = {
  places: Place[];
  deletingPlaceId: string | null;
  onEditPlace: (place: Place) => void;
  onDeletePlace: (place: Place) => void;
};

export function AdminRecentPlacesPanel({
  places,
  deletingPlaceId,
  onEditPlace,
  onDeletePlace,
}: AdminRecentPlacesPanelProps) {
  return (
    <div className="admin-panel">
      <h2>Locais recentes</h2>
      <div className="admin-list">
        {places.slice(0, 8).map((place) => (
          <div className="admin-list-item" key={place.id}>
            <span className="color-dot" />
            <div>
              <strong>{place.name}</strong>
              <p>{place.category.name}</p>
            </div>
            <div className="admin-list-actions">
              <small>{place.neighborhood}</small>
              <div className="admin-action-row">
                <button className="admin-edit-button" onClick={() => onEditPlace(place)} type="button">
                  Editar
                </button>
                <button
                  className="admin-delete-button"
                  disabled={deletingPlaceId === place.id}
                  onClick={() => onDeletePlace(place)}
                  type="button"
                >
                  {deletingPlaceId === place.id ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
