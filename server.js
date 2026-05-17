// server.js
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors()); // Разрешаем CORS для всех доменов
app.use(express.json());

// Данные приложений
const apps = [
  { 
    id: 1, 
    title: "Атлас заметок", 
    price: 0, 
    free: true,
    category: "productivity",
    image:"https://s10.iimage.su/s/17/g13KUVrxzeCktaLvmzrAaAToBATvlCY0IrBg4I0Ub.png",
    description: "Приложение для создания и организации заметок с картами и синхронизацией",
    rating: 4.8,
    downloads: "1.2M"
  },
  { 
    id: 2, 
    title: "Переводчик", 
    price: 0, 
    free: true,
    category: "productivity",
    image:"https://s10.iimage.su/s/17/gpEfVoNxZy13PCv2jovzFRg9i12bZkfHwjIiZDqAM.png",
    description: "Мгновенный перевод текста на 100+ языков с поддержкой голоса",
    rating: 4.6,
    downloads: "5M"
  },
  { 
    id: 3, 
    title: "Джейсон", 
    price: 0, 
    free: true,
    category: "development",
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
    category: "productivity",
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
    category: "productivity",
    image:"https://s10.iimage.su/s/17/gQcDC4vxMZhgbjgyVqEep7L08XS0CgkHlof1nZGjO.png",
    description: "Профессиональный почтовый клиент с поддержкой шифрования и фильтрами",
    rating: 4.9,
    downloads: "3.5M"
  },
  { 
    id: 6, 
    title: "Видеоредактор", 
    price: 9.99, 
    free: false,
    category: "design",
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
    category: "design",
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
    category: "productivity",
    image: "https://s10.iimage.su/s/17/gmNneqaxEiWNLOC9yOqCNs9eGz5XfNhQ3c8QiLeNM.png",
    description: "Простой и быстрый блокнот для повседневных заметок без лишних функций",
    rating: 4.4,
    downloads: "900K"
  },
];

// === ROUTES ===

// GET /api/apps - Получить все приложения с фильтрацией
app.get('/api/apps', (req, res) => {
  let result = [...apps];
  
  // Фильтр по поиску
  if (req.query.search) {
    const searchTerm = req.query.search.toLowerCase();
    result = result.filter(app => 
      app.title.toLowerCase().includes(searchTerm) ||
      app.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Фильтр по бесплатным
  if (req.query.free === 'true') {
    result = result.filter(app => app.free === true);
  }
  
  // Фильтр по категории
  if (req.query.category) {
    result = result.filter(app => app.category === req.query.category);
  }
  
  // Добавляем задержку для имитации реальной сети
  setTimeout(() => {
    res.json(result);
  }, 500);
});

// GET /api/apps/:id - Получить одно приложение по ID
app.get('/api/apps/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const app = apps.find(a => a.id === id);
  
  if (app) {
    res.json(app);
  } else {
    res.status(404).json({ error: 'Приложение не найдено' });
  }
});

// GET /api/categories - Получить список категорий
app.get('/api/categories', (req, res) => {
  const categories = [...new Set(apps.map(app => app.category))];
  res.json(categories);
});

// POST /api/apps - Добавить новое приложение (для демонстрации)
app.post('/api/apps', (req, res) => {
  const maxId = apps.length > 0 ? Math.max(...apps.map(a => a.id)) : 0;
  const newApp = {
    id: maxId + 1,
    ...req.body
  };
  apps.push(newApp);
  res.status(201).json(newApp);
});

// Корневой роут
app.get('/', (req, res) => {
  res.json({
    message: 'MiniStore API',
    endpoints: {
      'GET /api/apps': 'Получить все приложения',
      'GET /api/apps?search=текст': 'Поиск приложений',
      'GET /api/apps?free=true': 'Только бесплатные',
      'GET /api/apps?category=productivity': 'По категории',
      'GET /api/apps/:id': 'Получить приложение по ID',
      'GET /api/categories': 'Получить список категорий',
      'POST /api/apps': 'Добавить приложение'
    }
  });
});

// Запуск сервера
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен на http://localhost:${PORT}`);
  console.log(`📡 API доступен по адресу http://localhost:${PORT}/api/apps`);
  console.log(`\nПримеры запросов:`);
  console.log(`  http://localhost:${PORT}/api/apps`);
  console.log(`  http://localhost:${PORT}/api/apps?search=блокнот`);
  console.log(`  http://localhost:${PORT}/api/apps?free=true`);
  console.log(`  http://localhost:${PORT}/api/apps?category=productivity`);
});