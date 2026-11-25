export const CATEGORIES = [
    { id: 'all', name: 'Всё меню', emoji: '' },
    { id: 'rolls', name: 'Роллы', emoji: '' },
    { id: 'sushi', name: 'Суши', emoji: '' },
    { id: 'sets', name: 'Сеты', emoji: '' },
    { id: 'hot', name: 'Горячее', emoji: '' },
    { id: 'soups', name: 'Супы', emoji: '' },
    { id: 'salads', name: 'Салаты', emoji: '' },
    { id: 'desserts', name: 'Десерты', emoji: '' },
    { id: 'drinks', name: 'Напитки', emoji: '' },
];

export const MENU = [
    // ── РОЛЛЫ ──
    { id: 1, name: 'Филадельфия', price: 85000, category: 'rolls', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600', description: 'Лосось, сливочный сыр, огурец, рис, нори' },
    { id: 2, name: 'Калифорния', price: 75000, category: 'rolls', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600', description: 'Краб, авокадо, огурец, икра тобико' },
    { id: 3, name: 'Дракон', price: 95000, category: 'rolls', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600', description: 'Угорь, авокадо, огурец, соус унаги' },
    { id: 4, name: 'Спайси Лосось', price: 80000, category: 'rolls', image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=600', description: 'Лосось, спайси-соус, огурец' },
    { id: 11, name: 'Аляска', price: 90000, category: 'rolls', image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600', description: 'Лосось, авокадо, огурец, икра' },

    // ── СУШИ ──
    { id: 5, name: 'Нигири Лосось', price: 25000, category: 'sushi', image: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=600', description: 'Классические нигири с лососем' },
    { id: 6, name: 'Нигири Угорь', price: 30000, category: 'sushi', image: 'https://images.unsplash.com/photo-1607301406259-dfb186e15de8?w=600', description: 'Нигири с копчёным угрём' },
    { id: 12, name: 'Гункан Тунец', price: 32000, category: 'sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600', description: 'Гункан с тунцом и спайси-соусом' },

    // ── СЕТЫ ──
    { id: 7, name: 'Сет Токио', price: 250000, category: 'sets', image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=600', description: '32 кусочка: Филадельфия, Калифорния, Дракон, Спайси' },
    { id: 8, name: 'Сет Мини', price: 150000, category: 'sets', image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=600', description: '16 кусочков ассорти' },
    { id: 13, name: 'Сет Премиум', price: 380000, category: 'sets', image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600', description: '48 кусочков премиальных роллов' },

    // ── ГОРЯЧЕЕ ──
    { id: 14, name: 'Темпура креветка', price: 65000, category: 'hot', image: 'https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=600', description: 'Хрустящие креветки в кляре темпура' },
    { id: 15, name: 'Курица терияки', price: 58000, category: 'hot', image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600', description: 'Куриное филе в соусе терияки с рисом' },

    // ── СУПЫ ──
    { id: 16, name: 'Мисо суп', price: 22000, category: 'soups', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600', description: 'Классический японский суп с тофу и водорослями' },
    { id: 17, name: 'Том Ям', price: 48000, category: 'soups', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600', description: 'Острый тайский суп с креветками' },

    // ── САЛАТЫ ──
    { id: 18, name: 'Салат Чука', price: 38000, category: 'salads', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600', description: 'Водоросли чука с ореховым соусом' },
    { id: 19, name: 'Цезарь с креветкой', price: 52000, category: 'salads', image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600', description: 'Классический цезарь с тигровыми креветками' },

    // ── ДЕСЕРТЫ ──
    { id: 20, name: 'Моти ассорти', price: 35000, category: 'desserts', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600', description: 'Традиционные японские пирожные моти' },
    { id: 21, name: 'Чизкейк', price: 32000, category: 'desserts', image: 'https://images.unsplash.com/photo-1568051243851-f9b136146e97?w=600', description: 'Нежный японский чизкейк' },

    // ── НАПИТКИ ──
    { id: 9, name: 'Кола', price: 12000, category: 'drinks', image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600', description: '0.5 л' },
    { id: 10, name: 'Зелёный чай', price: 8000, category: 'drinks', image: 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=600', description: 'Горячий чай 300 мл' },
    { id: 22, name: 'Матча латте', price: 28000, category: 'drinks', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600', description: 'Японский зелёный чай с молоком' },
];