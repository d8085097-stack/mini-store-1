import { AppCardType } from "./types";

// Базовый URL API - локальный сервер
const API_BASE_URL = "http://localhost:4000/api";

// Интерфейс для параметров фильтра
export interface FilterParams {
  search?: string;
  free?: boolean;
  category?: string;
}

/**
 * Получить список всех приложений
 */
export async function getApps(): Promise<AppCardType[]> {
  const response = await fetch(`${API_BASE_URL}/apps`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

/**
 * Получить список приложений с фильтрами
 * Использует URLSearchParams для формирования query параметров
 */
export async function getAppsWithFilters(filters: FilterParams): Promise<AppCardType[]> {
  // Создаем URLSearchParams для query параметров
  const params = new URLSearchParams();
  
  if (filters.search) {
    params.append("search", filters.search);
  }
  
  if (filters.free !== undefined) {
    params.append("free", filters.free.toString());
  }
  
  if (filters.category) {
    params.append("category", filters.category);
  }
  
  // Формируем полный URL с параметрами
  const url = `${API_BASE_URL}/apps?${params.toString()}`;
  
  console.log('Fetching:', url); // Для отладки
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

/**
 * Получить одно приложение по ID
 */
export async function getAppById(id: number): Promise<AppCardType> {
  const response = await fetch(`${API_BASE_URL}/apps/${id}`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

/**
 * Создать новое приложение (для практики POST запросов)
 */
export async function createApp(app: Omit<AppCardType, 'id'>): Promise<AppCardType> {
  const response = await fetch(`${API_BASE_URL}/apps`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(app),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

/**
 * Пример использования с then/catch (старый способ)
 */
export function getAppsOldStyle(): Promise<AppCardType[]> {
  return fetch(`${API_BASE_URL}/apps`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Ошибка загрузки:", error);
      throw error;
    });
}