import { useState, useEffect } from 'react';
import './admin-styles.css';

type CoffeeCardType = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  image: string;
  description: string;
  rating: number;
  roastLevel: 'light' | 'medium' | 'dark';
  origin: string;
  flavor: string;
};


const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

export default function AdminPanel() {
  const [coffees, setCoffees] = useState<CoffeeCardType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<CoffeeCardType>>({});
  const [jsonView, setJsonView] = useState(false);

  // 1. ЗАГРУЗКА ДАННЫХ С СЕРВЕРА
  // Было:
  // const data = await res.getJson ? await res.json() : await res.json();

  // Замените всю функцию fetchCoffees на эту:
  const fetchCoffees = async () => {
    try {
      const res = await fetch(`${API_URL}/coffee`);
      if (!res.ok) throw new Error('Ошибка сети');
      const data = await res.json(); // <-- Исправлено здесь
      setCoffees(data);
    } catch (error) {
      alert('Не удалось загрузить данные с сервера. Проверьте, запущен ли бэкенд!');
    }
  };

  useEffect(() => {
    fetchCoffees();
  }, []);

  // 2. ДОБАВЛЕНИЕ НОВОГО КОФЕ
  const handleAdd = () => {
    setIsAdding(true);
    setFormData({
      name: '',
      price: 0,
      inStock: true,
      image: '',
      description: '',
      rating: 5,
      roastLevel: 'medium',
      origin: '',
      flavor: '',
    });
  };

  const handleEdit = (coffee: CoffeeCardType) => {
    setEditingId(coffee.id);
    setFormData(coffee);
  };

  // 3. УДАЛЕНИЕ С СЕРВЕРА
  const handleDelete = async (id: number) => {
    if (confirm('Удалить этот кофе?')) {
      try {
        const res = await fetch(`${API_URL}/coffee/${id}`, { method: 'DELETE' });
        if (res.ok) fetchCoffees();
      } catch (error) {
        alert('Ошибка при удалении');
      }
    }
  };

  // 4. СОХРАНЕНИЕ (ИЗМЕНЕНИЕ ИЛИ СОЗДАНИЕ)
  const handleSave = async () => {
    if (!formData.name || !formData.origin || !formData.flavor) {
      alert('Заполните все обязательные поля!');
      return;
    }

    try {
      if (isAdding) {
        // Создание элемента на сервере
        const res = await fetch(`${API_URL}/coffee/item`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) fetchCoffees();
      } else {
        // Обновление существующего элемента
        const res = await fetch(`${API_URL}/coffee/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (res.ok) fetchCoffees();
      }
      handleCancel();
    } catch (error) {
      alert('Ошибка при сохранении данных на сервер');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleInputChange = (field: keyof CoffeeCardType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(coffees, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'coffee_database.json';
    link.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (Array.isArray(data)) {
            const res = await fetch(`${API_URL}/coffee`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
            if (res.ok) {
              fetchCoffees();
              alert('Данные успешно импортированы!');
            }
          } else {
            alert('Неверный формат файла!');
          }
        } catch (error) {
          alert('Ошибка чтения файла!');
        }
      };
      reader.readAsText(file);
    }
  };

  // 5. СБРОС К ДЕФОЛТУ ЧЕРЕЗ СЕРВЕР
  const handleReset = async () => {
    if (confirm('Сбросить БД к начальным данным?')) {
      try {
        const res = await fetch(`${API_URL}/coffee/reset`, { method: 'POST' });
        if (res.ok) {
          fetchCoffees();
          alert('БД сброшена!');
        }
      } catch (error) {
        alert('Не удалось сбросить БД');
      }
    }
  };

  const getRoastLabel = (level: string): string => {
    const labels = { light: 'Светлая', medium: 'Средняя', dark: 'Темная' };
    return labels[level as keyof typeof labels] || level;
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>🔧 Админ-панель Coffee House</h1>
        <p>Управление базой данных кофе</p>
      </header>

      <div className="admin-actions">
        <button onClick={handleAdd} className="btn btn-primary">➕ Добавить кофе</button>
        <button onClick={handleExport} className="btn btn-success">📥 Экспорт JSON</button>
        <label className="btn btn-info">
          📤 Импорт JSON
          <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        </label>
        <button onClick={() => setJsonView(!jsonView)} className="btn btn-secondary">
          {jsonView ? '📋 Таблица' : '📄 JSON'}
        </button>
        <button onClick={handleReset} className="btn btn-danger">🔄 Сброс БД</button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{coffees.length}</div>
          <div className="stat-label">Всего позиций</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{coffees.filter((c) => c.inStock).length}</div>
          <div className="stat-label">В наличии</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {coffees.length > 0
              ? Math.round((coffees.reduce((sum, c) => sum + c.rating, 0) / coffees.length) * 10) / 10
              : 0}
          </div>
          <div className="stat-label">Средний рейтинг</div>
        </div>
      </div>

      {/* Форма добавления/редактирования */}
      {(editingId || isAdding) && (
        <div className="edit-form">
          <h3>{isAdding ? 'Добавление нового кофе' : 'Редактирование'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Название *</label>
              <input type="text" value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input type="number" value={formData.price || 0} onChange={(e) => handleInputChange('price', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>Происхождение *</label>
              <input type="text" value={formData.origin || ''} onChange={(e) => handleInputChange('origin', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Обжарка *</label>
              <select value={formData.roastLevel || 'medium'} onChange={(e) => handleInputChange('roastLevel', e.target.value)}>
                <option value="light">Светлая</option>
                <option value="medium">Средняя</option>
                <option value="dark">Темная</option>
              </select>
            </div>
            <div className="form-group">
              <label>Рейтинг (1-5) *</label>
              <input type="number" min="1" max="5" step="0.1" value={formData.rating || 5} onChange={(e) => handleInputChange('rating', Number(e.target.value))} />
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={formData.inStock || false} onChange={(e) => handleInputChange('inStock', e.target.checked)} /> В наличии
              </label>
            </div>
            <div className="form-group full-width">
              <label>URL изображения</label>
              <input type="text" value={formData.image || ''} onChange={(e) => handleInputChange('image', e.target.value)} />
            </div>
            <div className="form-group full-width">
              <label>Вкусовой профиль *</label>
              <input type="text" value={formData.flavor || ''} onChange={(e) => handleInputChange('flavor', e.target.value)} />
            </div>
            <div className="form-group full-width">
              <label>Описание</label>
              <textarea value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} rows={3} />
            </div>
          </div>
          <div className="form-actions">
            <button onClick={handleSave} className="btn btn-success">✅ Сохранить</button>
            <button onClick={handleCancel} className="btn btn-secondary">❌ Отмена</button>
          </div>
        </div>
      )}

      {jsonView ? (
        <div className="json-view">
          <h3>JSON База данных</h3>
          <pre>{JSON.stringify(coffees, null, 2)}</pre>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Фото</th>
                <th>Название</th>
                <th>Цена</th>
                <th>Обжарка</th>
                <th>Происхождение</th>
                <th>Рейтинг</th>
                <th>Наличие</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {coffees.map((coffee) => (
                <tr key={coffee.id}>
                  <td>{coffee.id}</td>
                  <td><img src={coffee.image} alt={coffee.name} className="table-img" /></td>
                  <td>
                    <strong>{coffee.name}</strong><br /><small>{coffee.flavor}</small>
                  </td>
                  <td>{coffee.price} ₽</td>
                  <td><span className={`badge badge-${coffee.roastLevel}`}>{getRoastLabel(coffee.roastLevel)}</span></td>
                  <td>{coffee.origin}</td>
                  <td>⭐ {coffee.rating}</td>
                  <td><span className={`status ${coffee.inStock ? 'in-stock' : 'out-stock'}`}>{coffee.inStock ? '✓ Есть' : '✗ Нет'}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(coffee)} className="btn-icon btn-edit" title="Редактировать">✏️</button>
                      <button onClick={() => handleDelete(coffee.id)} className="btn-icon btn-delete" title="Удалить">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}