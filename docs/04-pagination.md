# Пагинация: контракт API и пример на фронте

## Offset vs page

- **Offset** — «пропустить N записей»: удобно для бесконечного скролла.
- **Page** — «страница номер P при размере страницы L»: проще для кнопок «Назад / Вперёд».

В учебном API используется **`page`** и **`limit`**. Сервер возвращает:

```json
{
  "data": [ /* записи текущей страницы */ ],
  "total": 42,
  "page": 1,
  "limit": 10
}
```

**Общее число страниц:** `totalPages = Math.ceil(total / limit)` (при `total === 0` удобно показывать 0 страниц или одну пустую).

## Где в учебном API такой контракт

| Метод | Путь | Query | Ответ |
|--------|------|--------|--------|
| GET | `/spaces` | `page`, `limit` (+ фильтры каталога) | `{ data, total, page, limit }` |
| GET | `/users` | `page`, `limit` | то же (**только admin**) |
| GET | `/bookings` | `page`, `limit`, опционально `status` | то же (Bearer) |
| GET | `/reviews` | обязательный `spaceId`, плюс `page`, `limit` | то же; **без** скрытых отзывов (`isHidden`) |
| GET | `/reviews/manage` | `spaceId`, `page`, `limit` | то же; **все** отзывы зоны (**manager**, **admin**) |

**Исключение — «популярное»:** `GET /spaces/popular?limit=` возвращает **массив** зон (без обёртки `data`/`total`), только параметр **`limit`** (по умолчанию на бэке 3, верхняя граница 20). Пагинации по страницам там нет.

По умолчанию на бэке: **`page = 1`**, **`limit = 10`**, максимум **`limit = 100`**. Базовый URL API без префикса `/api`: например **`http://localhost:3010`** (порт из `PORT` / `.env`).

## Зачем серверная пагинация

При большом числе записей нельзя тащить все элементы на клиент: медленно и расточительно. Фильтры и сортировка должны применяться **на сервере** вместе с `page`/`limit`, чтобы каждая страница соответствовала текущим условиям.

## Пример: состояние страницы + запрос (React)

Идея: хранить `page` и `limit` в состоянии (или в URL через `useSearchParams`), передавать в query-параметры API.

```tsx
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

type PageResponse<T> = { data: T[]; total: number; page: number; limit: number };

// База без /api: Vite — import.meta.env.VITE_API_URL ?? 'http://localhost:3010'
const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3010';

async function fetchSpaces(page: number, limit: number): Promise<PageResponse<unknown>> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  const res = await fetch(`${API_BASE}/spaces?${params}`);
  if (!res.ok) throw new Error('Не удалось загрузить список');
  return res.json();
}

export function SpacesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ['spaces', page, limit],
    queryFn: () => fetchSpaces(page, limit),
    placeholderData: (prev) => prev, // v5; в v4 было keepPreviousData: true
  });

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.limit));
  }, [data]);

  return (
    <section>
      {isLoading && <p>Загрузка…</p>}
      {isError && <p>Ошибка загрузки</p>}
      {data && (
        <>
          <p>
            Страница {data.page} из {totalPages} (всего записей: {data.total})
          </p>
          <ul>
            {data.data.map((row: { id: number; title: string }) => (
              <li key={row.id}>{row.title}</li>
            ))}
          </ul>
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Назад
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Вперёд
          </button>
        </>
      )}
    </section>
  );
}
```

При необходимости замените `fetch` на **axios** с тем же `API_BASE` из env; добавьте в `queryKey` параметры фильтров, чтобы при смене фильтра запрос и страница были согласованы (часто сбрасывают `page` на `1`).

## UX

- Блокируйте кнопки пагинации на время **`isFetching`**, чтобы избежать двойных кликов.
- При **`placeholderData: (prev) => prev`** (TanStack Query v5) или **`keepPreviousData: true`** (v4) список не «мигает» пустым при переключении страницы.
