import type { Category } from '../../types/api';

type AdminCategoryPanelProps = {
  categories: Category[];
  categoryName: string;
  savingCategory: boolean;
  deletingCategoryId: string | null;
  onCategoryNameChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onDeleteCategory: (category: Category) => void;
};

export function AdminCategoryPanel({
  categories,
  categoryName,
  savingCategory,
  deletingCategoryId,
  onCategoryNameChange,
  onSubmit,
  onDeleteCategory,
}: AdminCategoryPanelProps) {
  return (
    <div className="admin-panel">
      <h2>Cadastrar categoria</h2>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          Nome da categoria
          <input value={categoryName} onChange={(event) => onCategoryNameChange(event.target.value)} required />
        </label>

        <button className="portal-primary-button" disabled={savingCategory} type="submit">
          {savingCategory ? 'Salvando...' : 'Criar categoria'}
        </button>
      </form>

      <div className="admin-mini-list">
        {categories.map((category) => (
          <div className="admin-mini-item" key={category.id}>
            <div>
              <strong>{category.name}</strong>
              <small>{category.slug}</small>
            </div>
            <button
              className="admin-delete-button"
              disabled={deletingCategoryId === category.id}
              onClick={() => onDeleteCategory(category)}
              type="button"
            >
              {deletingCategoryId === category.id ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
