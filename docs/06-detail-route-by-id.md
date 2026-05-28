# Страница одной сущности по `:id` (React Router v6)

## Маршрут

Вложенный параметр объявляется в пути:

```tsx
// фрагмент конфигурации маршрутов
{
  path: '/spaces',
  children: [
    { index: true, element: <SpacesListPage /> },
    { path: ':id', element: <SpaceDetailPage /> },
  ],
}
```

или плоско: `path: '/spaces/:id'`.

## Получение id

```tsx
import { useParams, useNavigate } from 'react-router-dom';

export function SpaceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // id — строка; для API часто нужно число:
  const numericId = Number(id);
  const invalid = Number.isNaN(numericId);

  // Загрузка: useQuery(['space', numericId], () => fetchSpace(numericId), { enabled: !invalid })
  // При 404 от API: показать «не найдено» и кнопку «К каталогу»: navigate('/spaces')
}
```

## Обработка состояний

| Состояние | Действие |
|-----------|----------|
| `id` невалиден | Сообщение «Неверная ссылка», редирект или 404-страница. |
| Загрузка | Loader в области контента. |
| Успех | Вывести **все поля** объекта из ответа API (в учебном задании это проверяется). |
| 404 от сервера | Текст «Зона не найдена», ссылка назад. |

С API при 404 приходит JSON вида `{ "error": "Space not found" }` (английский текст) — для интерфейса можно показать свой нейтральный текст, опираясь на код **404**, а не на дословный перевод поля `error`.

## Навигация со списка

В каталоге ссылка должна вести на детальную страницу:

```tsx
<Link to={`/spaces/${row.id}`}>{row.title}</Link>
```

## Итог

`useParams` даёт идентификатор из URL, запрос к `GET /spaces/:id` — данные карточки. Отдельно обработайте загрузку, ошибку и отсутствие сущности — без «белого экрана».
