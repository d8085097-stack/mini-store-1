import { useState, useEffect } from "react";
import { AppCardType } from "./types";
import "./styles.css";

export default function App() {
  const data: AppCardType[] = [
    { 
      id: 1, 
      title: "Атлас заметок", 
      price: 0, 
      free: true,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStA_G6nnjHivWse_fl2m0sWF67-2UHXZZ_qw&s",
      description: "Приложение для создания и организации заметок с картами и синхронизацией",
      rating: 4.8,
      downloads: "1.2M"
    },
    { 
      id: 2, 
      title: "Переводчик", 
      price: 0, 
      free: true,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGF5LOhTxfoGVf536N3N2MJrXiVdPKfJkygw&s",
      description: "Мгновенный перевод текста на 100+ языков с поддержкой голоса",
      rating: 4.6,
      downloads: "5M"
    },
    { 
      id: 3, 
      title: "Джейсон", 
      price: 0, 
      free: true,
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
      description: "Редактор JSON с визуализацией структуры данных и валидацией",
      rating: 4.5,
      downloads: "800K"
    },
    { 
      id: 4, 
      title: "Линза", 
      price: 0, 
      free: true,
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop",
      description: "Лупа для увеличения текста и изображений на экране с настройками контраста",
      rating: 4.7,
      downloads: "2.1M"
    },
    { 
      id: 5, 
      title: "Почтовый клиент", 
      price: 4.99, 
      free: false,
      image: "https://rskrf.ru/upload/iblock/41f/v3qad0nhzla6a4i60ixxkr2s0hao9p16.png",
      description: "Профессиональный почтовый клиент с поддержкой шифрования и фильтрами",
      rating: 4.9,
      downloads: "3.5M"
    },
    { 
      id: 6, 
      title: "Видеоредактор", 
      price: 9.99, 
      free: false,
      image: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop",
      description: "Мощный видеоредактор с эффектами, переходами и поддержкой 4K",
      rating: 4.7,
      downloads: "4.2M"
    },
    { 
      id: 7, 
      title: "Фотошоп", 
      price: 14.99, 
      free: false,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      description: "Профессиональное редактирование фотографий с AI-инструментами",
      rating: 4.8,
      downloads: "6.3M"
    },
    { 
      id: 8, 
      title: "Блокнот", 
      price: 0, 
      free: true,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcZikQ3hIPRxpRdWn2ejSxmM8bCGV1vwdz5Q&s",
      description: "Простой и быстрый блокнот для повседневных заметок без лишних функций",
      rating: 4.4,
      downloads: "900K"
    },
  ];

  const [searchText, setSearchText] = useState<string>("");
  const [filterFree, setFilterFree] = useState<boolean>(false);
  const [apps, setApps] = useState<AppCardType[]>(data);
  const [selectedApp, setSelectedApp] = useState<AppCardType | null>(null);

  useEffect(() => {
    const filteredApps = data.filter((app) => {
      const titleMatch = app.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const freeMatch = filterFree ? app.free : true;
      return titleMatch && freeMatch;
    });
    setApps(filteredApps);
  }, [searchText, filterFree]);

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
        <h2>Приложения ({apps.length})</h2>
        {apps.length === 0 ? (
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