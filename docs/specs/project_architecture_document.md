# project_architecture_document.md

## Цели архитектуры
- Быстро доставлять статический контент (миссия, категории, ресурсы) и масштабировать динамические разделы (материалы, обращения о молитве).
- Обеспечить управляемость контента через админку с ролями и аудитом.
- Использовать AWS как базовую платформу (хостинг, данные, авторизация, поиск, уведомления).

## Высокоуровневая схема (JAMstack + управляемые сервисы AWS)
- **Frontend**: Next.js (TypeScript, App Router), SSG для информационных страниц, SSR/CSR для динамики (формы, поиск).
- **API слой**: AWS AppSync (GraphQL) как основной шлюз; при необходимости REST-эндпоинты на API Gateway/Lambda.
- **Данные**:
  - DynamoDB — материалы, категории, теги, ресурсные карточки, обращения (молитва/вопросы), пользователи админки (минимум ссылочно).
  - S3 — медиа (изображения, аудио, видео); загрузка через pre-signed URLs.
  - OpenSearch — отложен и не входит в MVP (снижает расходы AWS); поиск в MVP строится на запросах к DynamoDB через AppSync (фильтры по категории/тегам/заголовку).
- **Аутентификация/авторизация**: Cognito User Pools, роли Admin/Editor/Moderator; защита админки и административных мутаций в AppSync.
- **Уведомления/почта**: SendGrid (через SSM Parameter Store для секретов) или SES для транзакционных писем.
- **Хостинг и CDN**: Amplify Hosting + CloudFront для статики; автоматический HTTPS.
- **IaC**: Amplify CLI (конфигурации `auth`, `api`, `storage`, `search`), хранение в репозитории; пайплайны dev/stage/prod.
- **Мониторинг и логи**: CloudWatch (API, Lambda), Amplify previews для проверок PR.

## Ключевые пользовательские сценарии (связка с функционалом)
- Просмотр главной и категорий (SSG); переход к темам и материалам (SSR/CSR при необходимости персонализации).
- Доступ к ресурсам (библиотека, детский, трансляции, музыка, газета) — статический контент с управляемыми ссылками.
- Отправка обращений (молитва, вопросы пастору) — форма → AppSync mutation → DynamoDB → уведомление админу.
- Поиск материалов — запрос в AppSync → DynamoDB (фильтры/startsWith по заголовку и тегам); полнотекстовый поиск через OpenSearch перенесён на Post-MVP.
- Админка: CRUD категорий, тем, материалов, ресурсов, управление медиа, модерация обращений, рассылки.

## Модель данных (эскиз для DynamoDB / AppSync)
- `Category` (id, title, icon, intro, order).
- `Topic` (id, categoryId, title, intro, order, linksToPosts).
- `Post` (id, slug, categoryId, topicId, title, body, tags[], status, heroImage, publishedAt, seo/meta).
- `ResourceCard` (id, slug, title, description, link, type).
- `PrayerRequest` (id, name?, contact?, text, status, createdAt, processedBy?).
- `NewsletterSubscriber` (id/email, status).
- `UserProfile` (id, role, name, email) — для админки.

## Потоки и интеграции
- **Контент**: админка → AppSync mutations → DynamoDB; медиа → S3; индекс в OpenSearch исключён из MVP (Post-MVP — синхронизация через Lambda/AppSync pipeline).
- **Обращения**: форма → AppSync → DynamoDB; notification Lambda → SendGrid/SES; модерация через админку.
- **Поиск**: запрос с фильтрами (category/tag/title prefix) → AppSync → DynamoDB → результаты на фронтенде; OpenSearch — в Post-MVP.
- **CD/CI**: push в main → Amplify build → deploy + CDN инвалидация; preview для PR.

## Нефункциональные требования (опорные)
- Быстрая первая отрисовка: SSG + CDN, оптимизация статики.
- Доступность: ARIA, фокус-менеджмент, читабельная типографика, поддержка клавиатуры.
- Безопасность: Cognito + RBAC, pre-signed URLs для upload, секреты в SSM, CORS/Rate limiting на API.
- Наблюдаемость: CloudWatch logs/metrics, тревоги по ошибкам Lambda/AppSync.

## Сопоставление с прототипом `html_version`
- Структура разделов (главная, категории, ресурсы, about, пост-шаблон) сохраняется и переезжает в Next.js.
- Навигация (header/breadcrumbs/footer) и карточные сетки — базовые компоненты для дальнейшей дизайн-системы.
- `meta robots: noindex` остаётся только на dev/stage; на prod — управляемые мета-теги SEO.

