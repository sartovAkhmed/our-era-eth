MVP: "Посади дерево — получи NFT" (короткий план и чеклист реализации)

Краткое описание
----------------
MVP позволяет пользователю купить NFT, который привязан к реальной посадке дерева. Админ подтверждает факт посадки и обновляет метаданные NFT с координатами, фото и датой. Пользователь видит свои NFT в личном кабинете и карту с местом посадки.

Ключевые страницы
-----------------
1. Главная (Landing)
   - Hero: CTA "Выбрать дерево" → маркетплейс
   - Блок "Как это работает" (3 шага)
2. Маркетплейс / Коллекция
   - 3 варианта NFT (Дуб / Семья кедров / Роща) с ценами и артом
   - Кнопка "Купить" → подключение кошелька и минт
3. Личный кабинет / Моя коллекция
   - Список купленных NFT
   - Статусы: "Готовится к посадке", "Посажено"
   - Для посаженных — карта (Google Maps / OSM), фото, порода, GPS, дата
4. Админ-панель
   - Список NFT и возможность "подтвердить посадку" (обновить метаданные, загрузить фото, задать GPS)

Смартф- и веб-UX
----------------
- Простая покупка: подключение MetaMask / WalletConnect
- Мобильная адаптивность
- Кнопка "Поделиться" на странице NFT

Смарт‑контракты (упрощённо)
---------------------------
Контракт ERC721 с минимальным набором:
- function mintNFT(address to, string memory tokenURI) external payable returns (uint256);
- function updateTokenMetadata(uint256 tokenId, string memory tokenURI) external onlyOwner;
- owner — команда/админ (можно multisig)
- событий: Transfer, MetadataUpdated(tokenId, newUri)

Архитектура backend
-------------------
(может быть упрощённо без отдельного бекенда — админ через dApp)
Варианты:
A) Админ использует фронтенд + контракт для updateTokenMetadata (IPFS URIs).
B) Небольшой backend (Node.js) для хранения загруженных фото → загружает в IPFS и возвращает URI; также даёт панель авторизации для админа.

Хранилище метаданных
-------------------
- Рекомендуется: IPFS (pinning service) для изображений и JSON метаданных.
- Формат JSON метаданных: { name, description, image, attributes: [{trait_type, value}], planting: {date, gps, photo, species, planter} }

Технологии
----------
- Smart contracts: Solidity, Hardhat (в проекте уже есть пакеты hardhat)
- Frontend: Next.js (в репозитории есть nextjs package)
- Wallet: wagmi/ethers.js
- Storage: IPFS (nft.storage / web3.storage) или локальный pinata
- Optional backend: Node.js/Express, Prisma/Postgres (если нужен DB)

Файловая структура (MVP, где создать новые файлы)
------------------------------------------------
- our-era-eth/packages/hardhat/contracts/TreeNFT.sol (новый или адаптировать TreeChain.sol)
- our-era-eth/packages/hardhat/deploy/02_deploy_tree_nft.ts
- our-era-eth/packages/nextjs/app/marketplace/page.tsx (UI коллекции)
- our-era-eth/packages/nextjs/app/my-collection/page.tsx
- our-era-eth/packages/nextjs/components/MintButton.tsx (интеграция с wagmi)
- our-era-eth/packages/nextjs/app/admin/* (админ-панель)
- scripts/ для загрузки метаданных в IPFS (scripts/pin-to-ipfs.js)

Милистоуны и чеклист реализации
------------------------------
- [x] Проанализировать требования (этот файл)
- [ ] Создать/адаптировать контракт ERC721 с mint и updateTokenMetadata
- [ ] Написать миграции/скрипты развертывания (Hardhat deploy)
- [ ] Настроить IPFS / NFT pinning скрипты
- [ ] Реализовать страницу маркетплейса (Next.js)
- [ ] Реализовать кнопку минта с оплатой (wagmi/ethers)
- [ ] Реализовать личный кабинет — список NFT (чтение с блокчейна)
- [ ] Добавить статус "Готовится к посадке" / "Посажено" (через метаданные)
- [ ] Реализовать админ-панель (обновление метаданных и загрузка фото)
- [ ] Интегрировать карту (Google Maps / OSM) для отображения координат
- [ ] Написать базовые тесты контрактов (Hardhat)
- [ ] Документация и инструкции по деплою
- [ ] Подготовить деплой на тестовую сеть (Goerli / Sepolia или другой)
- [ ] QA и smoke-тесты (минт → апдейт метаданных → отображение в UI)
- [ ] (Опционально) CI (GitHub Actions): тесты + проверка линтинга

Пошаговая последовательность действий (рекомендуемая)
---------------------------------------------------
1) Контракт
   - Создать контракт TreeNFT.sol (ERC721)
   - Реализовать mintNFT и updateTokenMetadata (onlyOwner)
   - Добавить event MetadataUpdated
   - Покрыть тестами: минт работает, update метаданных доступна только owner
2) Сборка метаданных и IPFS
   - Написать скрипт, который пинит изображение и JSON на nft.storage
   - Формат: tokenURI → ipfs://<cid>
3) Деплой (Hardhat)
   - Скрипт deploy: деплой контрактов и вывод адресов
4) Frontend — минимальный MVP
   - Маркетплейс: страницы с 3 товарами и кнопкой минт
   - MintButton: подключение кошелька и вызов mintNFT (payable)
   - My Collection: получение токенов по адресу пользователя (подключение к провайдеру)
   - Админ: авторизация (простая — кошелёк + проверка owner) + форма для updateTokenMetadata
5) Тестирование
   - Локально: hardhat node + frontend pointing to it
   - On-testnet: деплой, мининг, walkthrough
6) Релиз / инструкции
   - README с командами: yarn install, yarn workspace @hardhat build, yarn dev nextjs и т.д.

Команды разработки (пример)
--------------------------
# Установка зависимостей (в корне проекта, если workspace настроен)
yarn install

# Hardhat – локальная сеть
yarn workspace @our-era-eth/hardhat node
yarn workspace @our-era-eth/hardhat test
yarn workspace @our-era-eth/hardhat run scripts/deploy.ts --network localhost

# Next.js
cd packages/nextjs
yarn dev

Безопасность и замечания
-----------------------
- Обновление метаданных контрактом — централизованная операция (owner). Для доверия — использовать multisig.
- Сумма оплаты mint — валидировать в контракте (правильная цена для каждого tier).
- Проверьте ограничение reentrancy и переполнение (стандарт OpenZeppelin уменьшает риски).

Следующие шаги (предлагаю начать с)
----------------------------------
1. Создать или адаптировать `TreeNFT.sol` в our-era-eth/packages/hardhat/contracts
2. Написать тесты для mint и updateTokenMetadata
3. Создать минимальную страницу маркетплейса и кнопку минта

Если подтверждаете — я могу:
- Сгенерировать контракт (TreeNFT.sol) + тесты и deployment script (Hardhat)
- Или начать с фронтенда (MintButton + страница коллекции)
Выберите, с чего начать, и я выполню следующий шаг.
