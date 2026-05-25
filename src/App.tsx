import { useState, useEffect } from 'react';
import './styles.css';

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

const COFFEE_DATA: CoffeeCardType[] = [
  {
    id: 1,
    name: 'Эфиопия Yirgacheffe',
    price: 850,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop',
    description: 'Цветочный аромат с нотками жасмина и бергамота. Яркая кислотность.',
    rating: 4.9,
    roastLevel: 'light',
    origin: 'Эфиопия',
    flavor: 'Цветочный, цитрусовый',
  },
  {
    id: 2,
    name: 'Колумбия Supremo',
    price: 750,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop',
    description: 'Сбалансированный вкус с карамельными нотками и средней кислотностью.',
    rating: 4.7,
    roastLevel: 'medium',
    origin: 'Колумбия',
    flavor: 'Карамель, орехи',
  },
  {
    id: 3,
    name: 'Бразилия Сантос',
    price: 650,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&h=300&fit=crop',
    description: 'Мягкий, шоколадный вкус с низкой кислотностью. Идеален для эспрессо.',
    rating: 4.6,
    roastLevel: 'dark',
    origin: 'Бразилия',
    flavor: 'Шоколад, какао',
  },
  {
    id: 4,
    name: 'Кения АА',
    price: 950,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop',
    description: 'Яркая кислотность с нотками черной смородины и грейпфрута.',
    rating: 4.8,
    roastLevel: 'light',
    origin: 'Кения',
    flavor: 'Ягоды, цитрус',
  },
  {
    id: 5,
    name: 'Гватемала Антигуа',
    price: 800,
    inStock: false,
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',
    description: 'Пряный вкус с нотками какао и дымка. Средняя кислотность.',
    rating: 4.7,
    roastLevel: 'medium',
    origin: 'Гватемала',
    flavor: 'Специи, какао',
  },
  {
    id: 6,
    name: 'Итальянская обжарка',
    price: 700,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
    description: 'Классическая темная обжарка для эспрессо. Плотное тело, низкая кислотность.',
    rating: 4.5,
    roastLevel: 'dark',
    origin: 'Смесь',
    flavor: 'Горький шоколад',
  },
  {
    id: 7,
    name: 'Коста-Рика Тарразу',
    price: 880,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop',
    description: 'Чистый вкус с нотками меда и цитрусовых. Яркая кислотность.',
    rating: 4.8,
    roastLevel: 'light',
    origin: 'Коста-Рика',
    flavor: 'Мед, лимон',
  },
  {
    id: 8,
    name: 'Вьетнам Робуста',
    price: 550,
    inStock: true,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop',
    description: 'Крепкий кофе с высоким содержанием кофеина. Горький вкус.',
    rating: 4.3,
    roastLevel: 'dark',
    origin: 'Вьетнам',
    flavor: 'Землистый, орех',
  },
];

export default function App() {
  const [searchText, setSearchText] = useState<string>('');
  const [filterInStock, setFilterInStock] = useState<boolean>(false);
  const [roastLevel, setRoastLevel] = useState<string>('');
  const [coffees, setCoffees] = useState<CoffeeCardType[]>([]);
  const [selectedCoffee, setSelectedCoffee] = useState<CoffeeCardType | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoffees(COFFEE_DATA);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredCoffees = coffees.filter((coffee) => {
    const nameMatch = coffee.name.toLowerCase().includes(searchText.toLowerCase());
    const stockMatch = filterInStock ? coffee.inStock : true;
    const roastMatch = roastLevel ? coffee.roastLevel === roastLevel : true;
    return nameMatch && stockMatch && roastMatch;
  });

  const handleSearchInput = (event: React.FormEvent<HTMLInputElement>): void => {
    setSearchText(event.currentTarget.value);
  };

  const handleStockChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFilterInStock(event.currentTarget.checked);
  };

  const handleRoastChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setRoastLevel(event.currentTarget.value);
  };

  const closeModal = (): void => {
    setSelectedCoffee(null);
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if ((e.target as HTMLElement).className === 'modal') {
      closeModal();
    }
  };

  const getRoastLabel = (level: string): string => {
    const labels = {
      light: 'Светлая',
      medium: 'Средняя',
      dark: 'Темная',
    };
    return labels[level as keyof typeof labels] || level;
  };

  return (
    <div className="container">
      <header className="hero">
        <h1 className="header">☕ Coffee House</h1>
        <p className="subtitle">Лучший кофе со всего мира</p>
      </header>

      <div className="filter">
        <div className="search-section">
          <input
            type="text"
            placeholder="Поиск кофе..."
            value={searchText}
            onInput={handleSearchInput}
            className="search-input"
          />
        </div>

        <div className="checkbox-section">
          <label>
            <input
              type="checkbox"
              checked={filterInStock}
              onChange={handleStockChange}
              className="checkbox-input"
            />
            <span>Только в наличии</span>
          </label>
        </div>

        <div className="select-section">
          <select value={roastLevel} onChange={handleRoastChange} className="select-input">
            <option value="">Все обжарки</option>
            <option value="light">Светлая</option>
            <option value="medium">Средняя</option>
            <option value="dark">Темная</option>
          </select>
        </div>
      </div>

      <div className="apps-container">
        <h2>Наш ассортимент ({filteredCoffees.length})</h2>
        {filteredCoffees.length === 0 ? (
          <p className="no-results">Кофе не найден</p>
        ) : (
          <ul className="apps-list">
            {filteredCoffees.map((coffee) => (
              <li
                key={coffee.id}
                className={`app-card ${!coffee.inStock ? 'out-of-stock' : ''}`}
                onClick={() => setSelectedCoffee(coffee)}
              >
                <div className="app-image">
                  <img src={coffee.image} alt={coffee.name} />
                  {!coffee.inStock && <div className="stock-overlay">Нет в наличии</div>}
                </div>
                <div className="card-content">
                  <h3>{coffee.name}</h3>
                  <p className="origin">📍 {coffee.origin}</p>
                  <p className="roast-level">🔥 {getRoastLabel(coffee.roastLevel)} обжарка</p>
                  <div className="rating">
                    <span className="stars">⭐ {coffee.rating}</span>
                    <span className="flavor">{coffee.flavor}</span>
                  </div>
                  <p className="price">
                    <span className="price-badge">{coffee.price} ₽</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedCoffee && (
        <div className="modal" onClick={handleModalClick}>
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              ✕
            </button>
            <img src={selectedCoffee.image} alt={selectedCoffee.name} className="modal-image" />
            <div className="modal-info">
              <h2>{selectedCoffee.name}</h2>
              <div className="modal-details">
                <span className="detail-badge">📍 {selectedCoffee.origin}</span>
                <span className="detail-badge">🔥 {getRoastLabel(selectedCoffee.roastLevel)}</span>
                <span className="detail-badge">⭐ {selectedCoffee.rating}</span>
              </div>
              <p className="flavor-profile">
                <strong>Вкусовой профиль:</strong> {selectedCoffee.flavor}
              </p>
              <p className="modal-description">{selectedCoffee.description}</p>
              <div className="modal-footer">
                <span className="price-large">{selectedCoffee.price} ₽</span>
                {selectedCoffee.inStock ? (
                  <button className="btn-install">Добавить в корзину</button>
                ) : (
                  <button className="btn-buy" disabled>
                    Нет в наличии
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}