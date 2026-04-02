import type { Category } from '../../types/api';
import type { AdminPlaceFormState } from './types';

type AdminPlaceFormPanelProps = {
  categories: Category[];
  editingPlaceId: string | null;
  placeForm: AdminPlaceFormState;
  savingPlace: boolean;
  deletingPlaceId: string | null;
  onCancelEdit: () => void;
  onDeleteCurrentPlace: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: <K extends keyof AdminPlaceFormState>(field: K, value: AdminPlaceFormState[K]) => void;
};

export function AdminPlaceFormPanel({
  categories,
  editingPlaceId,
  placeForm,
  savingPlace,
  deletingPlaceId,
  onCancelEdit,
  onDeleteCurrentPlace,
  onSubmit,
  onChange,
}: AdminPlaceFormPanelProps) {
  return (
    <div className="admin-panel">
      <div className="admin-panel-heading">
        <h2>{editingPlaceId ? 'Editar local' : 'Cadastrar local'}</h2>
        {editingPlaceId ? (
          <div className="admin-action-row">
            <button className="admin-delete-button" disabled={deletingPlaceId === editingPlaceId} onClick={onDeleteCurrentPlace} type="button">
              {deletingPlaceId === editingPlaceId ? 'Excluindo...' : 'Excluir'}
            </button>
            <button className="ghost-button admin-inline-button" onClick={onCancelEdit} type="button">
              Cancelar
            </button>
          </div>
        ) : null}
      </div>
      <form className="admin-form admin-form-grid" onSubmit={onSubmit}>
        <label>
          Nome
          <input value={placeForm.name} onChange={(event) => onChange('name', event.target.value)} required />
        </label>

        <label>
          Categoria
          <select value={placeForm.categoryId} onChange={(event) => onChange('categoryId', event.target.value)} required>
            <option value="">Selecione</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="span-2">
          Endereço
          <input value={placeForm.address} onChange={(event) => onChange('address', event.target.value)} required />
        </label>

        <label>
          Bairro
          <input value={placeForm.neighborhood} onChange={(event) => onChange('neighborhood', event.target.value)} required />
        </label>

        <label>
          URL da imagem
          <input value={placeForm.imageUrl} onChange={(event) => onChange('imageUrl', event.target.value)} />
        </label>

        <label>
          Latitude
          <input
            step="any"
            type="number"
            value={placeForm.latitude}
            onChange={(event) => onChange('latitude', event.target.value)}
          />
        </label>

        <label>
          Longitude
          <input
            step="any"
            type="number"
            value={placeForm.longitude}
            onChange={(event) => onChange('longitude', event.target.value)}
          />
        </label>

        <label className="span-2">
          Descrição
          <textarea rows={4} value={placeForm.description} onChange={(event) => onChange('description', event.target.value)} required />
        </label>

        <button className="portal-primary-button span-2" disabled={savingPlace} type="submit">
          {savingPlace ? 'Salvando...' : editingPlaceId ? 'Salvar alterações' : 'Cadastrar local'}
        </button>
      </form>
    </div>
  );
}
