import { useState, useEffect } from "react";
import { AppCardType } from "./types";
import { getAppsWithFilters, FilterParams } from "./api";
import "./styles.css";

export default function App() {
  const [apps, setApps] = useState<AppCardType[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppCardType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  // Состояние для фильтров
  const [filters, setFilters] = useState<FilterParams>({
    search: "",
    free: undefined,
    category: "",
  });

  // Загрузка данных с сервера с применением фильтров
  useEffect(() => {
    const loadApps = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Реальный запрос к API
        const data = await getAppsWithFilters(filters);
        setApps(data);
        
      } catch (err) {
        const message = err instanceof Error ? err.message : "Ошибка загрузки";
        setError(message);
        console.error("Ошибка:", err);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, [filters]); // Перезагружаем при изменении фильтров

  // Обработчики для фильтров
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = event.currentTarget.value;
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleFreeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const checked = event.currentTarget.checked;
    setFilters((prev) => ({ ...prev, free: checked ? true : undefined }));
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.currentTarget.value;
    setFilters((prev) => ({ ...prev, category: value }));
  };

  const closeModal = (): void => {
    setSelectedApp(null);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if ((e.target as HTMLElement).className === "modal") {
      closeModal();
    }
  };

  return (
    <div className="container">
      <h1 className="header">MiniStore</h1>
      
      {/* Фильтры */}
      <div className="filter">
        {/* Поиск */}
        <div className="search-section">
          <input
            type="text"
            placeholder="Поиск приложений..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        {/* Фильтр бесплатных */}
        <div className="checkbox-section">
          <label>
            <input
              type="checkbox"
              checked={filters.free || false}
              onChange={handleFreeChange}
              className="checkbox-input"
            />
            <span>Только бесплатные</span>
          </label>
        </div>

        {/* Категория */}
        <div className="select-section">
          <select 
            value={filters.category || ""} 
            onChange={handleCategoryChange}
            className="select-input"
          >
            <option value="">Все категории</option>
            <option value="productivity">Продуктивность</option>
            <option value="design">Дизайн</option>
            <option value="development">Разработка</option>
          </select>
        </div>
      </div>

      {/* Состояние загрузки */}
      {loading && <p className="loading-message">⏳ Загрузка данных с сервера...</p>}
      
      {/* Ошибка */}
      {error && (
        <>
          <p className="error-message">⚠️ {error}</p>
          <p className="info-message">
            💡 Убедитесь, что сервер запущен: <code>npm run server</code>
          </p>
        </>
      )}

      {/* Список приложений */}
      <div className="apps-container">
        <h2>Приложения ({apps.length})</h2>
        {apps.length === 0 && !loading && !error ? (
          <p className="no-results">Приложений не найдено</p>
        ) : (
          <ul className="apps-list">
            {apps.map((app) => (
              <li 
                key={app.id} 
                className="app-card"
                onClick={() => setSelectedApp(app)}
              >
                <div className="app-image">
                  <img src={app.image} alt={app.title} />
                </div>
                <h3>{app.title}</h3>
                <div className="rating">
                  <span className="stars">★ {app.rating}</span>
                  <span className="downloads">{app.downloads}</span>
                </div>
                <p className="price">
                  {app.free ? (
                    <span className="free-badge">Бесплатное</span>
                  ) : (
                    <span className="paid-badge">${app.price}</span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Модальное окно */}
      {selectedApp && (
        <div className="modal" onClick={handleModalClick}>
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>✕</button>
            <img src={selectedApp.image} alt={selectedApp.title} className="modal-image" />
            <div className="modal-info">
              <h2>{selectedApp.title}</h2>
              <div className="modal-rating">
                <span className="stars">★ {selectedApp.rating}</span>
                <span className="downloads">{selectedApp.downloads} загрузок</span>
              </div>
              <p className="modal-description">{selectedApp.description}</p>
              <div className="modal-footer">
                {selectedApp.free ? (
                  <button className="btn-install">Установить</button>
                ) : (
                  <>
                    <span className="price-large">${selectedApp.price}</span>
                    <button className="btn-buy">Купить</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}