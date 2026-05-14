import { useState, useEffect } from "react";
import { AppCardType } from "./types";
import "./styles.css";

export default function App() {
  const [searchText, setSearchText] = useState<string>("");
  const [filterFree, setFilterFree] = useState<boolean>(false);
  const [apps, setApps] = useState<AppCardType[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppCardType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // Загрузка данных с сервера при монтировании компонента
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://ministore.ru/api/apps");
        
        if (!response.ok) {
          throw new Error("Ошибка загрузки данных");
        }
        
        const data: AppCardType[] = await response.json();
        setApps(data);
        setError("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
        // Запасные данные для демонстрации
        setApps(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []); // Пустой массив = выполнится один раз при монтировании

  // Фильтрация приложений
  const filteredApps = apps.filter((app) => {
    const titleMatch = app.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const freeMatch = filterFree ? app.free : true;
    return titleMatch && freeMatch;
  });

  const handleSearchInput = (event: React.FormEvent<HTMLInputElement>): void => {
    const text = event.currentTarget.value;
    setSearchText(text);
  };

  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const isChecked = event.currentTarget.checked;
    setFilterFree(isChecked);
  };

  const closeModal = (): void => {
    setSelectedApp(null);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if ((e.target as HTMLElement).className === "modal") {
      closeModal();
    }
  };

  // Отображение загрузки
  if (loading) {
    return (
      <div className="container">
        <h1 className="header">MiniStore</h1>
        <p className="loading-message">Загрузка приложений...</p>
      </div>
    );
  }

  // Отображение ошибки
  if (error) {
    return (
      <div className="container">
        <h1 className="header">MiniStore</h1>
        <p className="error-message">⚠️ {error}</p>
        <p className="info-message">Используются демо-данные</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="header">MiniStore</h1>
      
      <div className="filter">
        <div className="search-section">
          <input
            type="text"
            placeholder="Поиск приложений..."
            value={searchText}
            onInput={handleSearchInput}
            className="search-input"
          />
          <p className="search-value">Поиск: {searchText || "все приложения"}</p>
        </div>

        <div className="checkbox-section">
          <label>
            <input
              type="checkbox"
              checked={filterFree}
              onChange={handleCheckbox}
              className="checkbox-input"
            />
            <span>Показать только бесплатные</span>
          </label>
          <p className="checkbox-value">
            Фильтр: {filterFree ? "Только бесплатные" : "Все приложения"}
          </p>
        </div>
      </div>

      <div className="apps-container">
        <h2>Приложения ({filteredApps.length})</h2>
        {filteredApps.length === 0 ? (
          <p className="no-results">Приложений не найдено</p>
        ) : (
          <ul className="apps-list">
            {filteredApps.map((app) => (
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

// Запасные данные на случай ошибки загрузки
function getFallbackData(): AppCardType[] {
  return [
    { 
      id: 1, 
      title: "Атлас заметок", 
      price: 0, 
      free: true,
      image: "https://images.unsplash.com/photo-1507842217343-583f7270bfba?w=400&h=300&fit=crop",
      description: "Приложение для создания и организации заметок с картами и синхронизацией",
      rating: 4.8,
      downloads: "1.2M"
    },
    { 
      id: 2, 
      title: "Переводчик", 
      price: 0, 
      free: true,
      image: "https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=300&fit=crop",
      description: "Мгновенный перевод текста на 100+ языков с поддержкой голоса",
      rating: 4.6,
      downloads: "5M"
    },
    { 
      id: 5, 
      title: "Почтовый клиент", 
      price: 4.99, 
      free: false,
      image: "https://images.unsplash.com/photo-1563586348-c89f172d4c75?w=400&h=300&fit=crop",
      description: "Профессиональный почтовый клиент с поддержкой шифрования и фильтрами",
      rating: 4.9,
      downloads: "3.5M"
    },
  ];
}
