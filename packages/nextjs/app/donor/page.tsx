"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { BuildingOfficeIcon, CurrencyDollarIcon, HeartIcon, MapPinIcon, UserIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type DonorType = "individual" | "enterprise";

// Список доступных мест для посадки
const PLANTING_LOCATIONS = [
  { id: 1, name: "Москва, парк Сокольники" },
  { id: 2, name: "Москва, ВДНХ" },
  { id: 3, name: "Москва, Лосиный Остров" },
  { id: 4, name: "Санкт-Петербург, Летний сад" },
  { id: 5, name: "Санкт-Петербург, Таврический сад" },
  { id: 6, name: "Казань, парк Горького" },
  { id: 7, name: "Сочи, дендрарий" },
  { id: 8, name: "Екатеринбург, Харитоновский парк" },
  { id: 9, name: "Новосибирск, Ботанический сад" },
  { id: 10, name: "Краснодар, Солнечный остров" },
];

const DonorPage = () => {
  const { address: connectedAddress } = useAccount();
  const [treeCount, setTreeCount] = useState(1);
  const [location, setLocation] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [donorType, setDonorType] = useState<DonorType>("individual");
  const [enterpriseName, setEnterpriseName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Читаем статистику пользователя
  const { data: userStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getUserStats",
    args: [connectedAddress],
  });

  // Читаем статистику предприятия (если есть)
  const { data: enterpriseStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getEnterpriseStats",
    args: [connectedAddress],
    query: {
      enabled: donorType === "enterprise" && !!connectedAddress,
    },
  });

  // Читаем цену дерева
  const { data: treePrice } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "TREE_PRICE",
  });

  // Хук для покупки дерева индивидуальным донором
  const { writeContractAsync: purchaseTreeAsync } = useScaffoldWriteContract({
    contractName: "TreeChain",
  });

  // Хук для покупки дерева предприятием
  const { writeContractAsync: purchaseTreeAsEnterpriseAsync } = useScaffoldWriteContract({
    contractName: "TreeChain",
  });

  // Фильтруем локации по поисковому запросу
  const filteredLocations = PLANTING_LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(searchLocation.toLowerCase()),
  );

  const handleLocationSelect = (locationName: string) => {
    setLocation(locationName);
    setSearchLocation(locationName);
    setShowLocationDropdown(false);
  };

  const handleTreeCountChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1) {
      setTreeCount(numValue);
    } else if (value === "") {
      setTreeCount(1);
    }
  };

  const handleTreeCountBlur = () => {
    if (treeCount < 1) {
      setTreeCount(1);
    }
  };

  const incrementTreeCount = (increment: number) => {
    setTreeCount(prev => Math.max(1, prev + increment));
  };

  const handlePurchaseTree = async () => {
    if (!location) {
      alert("Пожалуйста, выберите местоположение для посадки");
      return;
    }

    if (treeCount < 1) {
      alert("Количество деревьев должно быть не менее 1");
      return;
    }

    if (donorType === "enterprise" && !enterpriseName.trim()) {
      alert("Пожалуйста, укажите название предприятия");
      return;
    }

    if (!treePrice) {
      alert("Не удалось получить цену дерева");
      return;
    }

    setIsLoading(true);
    try {
      const totalPrice = BigInt(treeCount) * treePrice;

      if (donorType === "individual") {
        await purchaseTreeAsync({
          functionName: "purchaseTree",
          args: [treeCount, location],
          value: totalPrice,
        });
        alert(`Успешно куплено ${treeCount} деревьев! Вы получили NFT сертификат.`);
      } else {
        await purchaseTreeAsEnterpriseAsync({
          functionName: "purchaseTreeAsEnterprise",
          args: [treeCount, location, enterpriseName],
          value: totalPrice,
        });
        alert(
          `Успешно куплено ${treeCount} деревьев от имени предприятия "${enterpriseName}"! Вы получили NFT сертификат.`,
        );
      }

      // Сброс формы
      setTreeCount(1);
      setLocation("");
      setSearchLocation("");
      setEnterpriseName("");
    } catch (error) {
      console.error("Ошибка при покупке дерева:", error);
      alert("Ошибка при покупке дерева. Проверьте консоль для подробностей.");
    } finally {
      setIsLoading(false);
    }
  };

  // Определяем отображаемую статистику в зависимости от типа донора
  const displayStats = donorType === "enterprise" ? enterpriseStats : userStats;
  const treesDonated = displayStats?.[0]?.toString() || "0";
  const totalSpent = ((Number(treesDonated) || 0) * 0.01).toFixed(2);

  // Рассчитываем общую стоимость
  const totalCost = treePrice ? (Number(treePrice) / 1e18) * treeCount : 0;

  if (!connectedAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Подключите кошелек</h1>
          <p className="text-gray-600">Для покупки деревьев необходимо подключить кошелек</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <HeartIcon className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-4xl font-bold text-green-600 mb-4">🌳 Покупка деревьев</h1>
          <p className="text-lg text-gray-600">Поддержите экологические проекты, купив NFT сертификаты деревьев</p>
        </div>

        {/* Выбор типа донора */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-center">Тип донора</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setDonorType("individual")}
              className={`p-4 rounded-lg border-2 transition-all ${
                donorType === "individual" ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-300"
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <UserIcon className="h-8 w-8 mr-2" />
                <span className="text-lg font-semibold">Индивидуально</span>
              </div>
              <p className="text-sm text-gray-600">Покупка от физического лица</p>
            </button>

            <button
              onClick={() => setDonorType("enterprise")}
              className={`p-4 rounded-lg border-2 transition-all ${
                donorType === "enterprise" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <BuildingOfficeIcon className="h-8 w-8 mr-2" />
                <span className="text-lg font-semibold">Предприятие</span>
              </div>
              <p className="text-sm text-gray-600">Покупка от компании или организации</p>
            </button>
          </div>
        </div>

        {/* Статистика */}
        {(userStats || enterpriseStats) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div
              className={`p-6 rounded-lg text-center ${donorType === "individual" ? "bg-green-100" : "bg-blue-100"}`}
            >
              <div className="text-4xl mb-2">🌳</div>
              <p className="text-2xl font-bold text-green-600">{treesDonated}</p>
              <p className="text-sm text-gray-600">
                {donorType === "individual" ? "Деревьев пожертвовано" : "Деревьев пожертвовано предприятием"}
              </p>
            </div>
            <div
              className={`p-6 rounded-lg text-center ${donorType === "individual" ? "bg-green-100" : "bg-blue-100"}`}
            >
              <CurrencyDollarIcon className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{totalSpent} ETH</p>
              <p className="text-sm text-gray-600">
                {donorType === "individual" ? "Потрачено на деревья" : "Потрачено предприятием на деревья"}
              </p>
            </div>
          </div>
        )}

        {/* Форма покупки */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {donorType === "individual" ? "Купить деревья" : "Купить деревья от предприятия"}
          </h2>

          <div className="space-y-6">
            {donorType === "enterprise" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Название предприятия *</label>
                <input
                  type="text"
                  value={enterpriseName}
                  onChange={e => setEnterpriseName(e.target.value)}
                  placeholder="Например: ООО 'ЭкоСтрой', ЗАО 'Зеленый мир'..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Это название будет указано в NFT сертификате и публичной статистике
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Количество деревьев *</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => incrementTreeCount(-1)}
                  disabled={treeCount <= 1}
                  className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
                >
                  -
                </button>

                <div className="relative flex-1">
                  <input
                    type="number"
                    value={treeCount}
                    onChange={e => handleTreeCountChange(e.target.value)}
                    onBlur={handleTreeCountBlur}
                    min="1"
                    className="w-full px-4 py-3 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-bold"
                  />
                </div>

                <button
                  onClick={() => incrementTreeCount(1)}
                  className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>

              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => incrementTreeCount(5)}
                  className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                >
                  +5
                </button>
                <button
                  onClick={() => incrementTreeCount(10)}
                  className="flex-1 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors"
                >
                  +10
                </button>
                <button
                  onClick={() => setTreeCount(1)}
                  className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Сброс
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                Выберите количество деревьев для посадки. Можно ввести число вручную или использовать кнопки
              </p>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Местоположение для посадки *</label>
              <div className="relative">
                <MapPinIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={e => {
                    setSearchLocation(e.target.value);
                    setShowLocationDropdown(true);
                    if (!e.target.value) {
                      setLocation("");
                    }
                  }}
                  onFocus={() => setShowLocationDropdown(true)}
                  placeholder="Начните вводить название места..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {showLocationDropdown && filteredLocations.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredLocations.map(location => (
                    <button
                      key={location.id}
                      onClick={() => handleLocationSelect(location.name)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      {location.name}
                    </button>
                  ))}
                </div>
              )}

              {showLocationDropdown && searchLocation && filteredLocations.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                  <div className="px-4 py-2 text-gray-500">Местоположение не найдено</div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Стоимость:</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Цена за 1 дерево:</span>
                  <span className="font-semibold">
                    {treePrice ? `${(Number(treePrice) / 1e18).toFixed(4)} ETH` : "Загрузка..."}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Количество:</span>
                  <span className="font-semibold">{treeCount} шт.</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold text-green-600">
                  <span>Итого:</span>
                  <span>{totalCost.toFixed(4)} ETH</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Включает: посадку деревьев, NFT сертификаты, верификацию</p>
              {donorType === "enterprise" && (
                <p className="text-sm text-blue-600 mt-1">
                  ✅ NFT сертификаты будут содержать название вашего предприятия
                </p>
              )}
            </div>

            <button
              onClick={handlePurchaseTree}
              disabled={isLoading || !location || treeCount < 1 || (donorType === "enterprise" && !enterpriseName)}
              className={`w-full py-3 px-6 rounded-md font-semibold text-white transition-colors ${
                donorType === "individual" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
              } disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {isLoading
                ? "Покупка..."
                : donorType === "individual"
                  ? `Купить ${treeCount} ${treeCount === 1 ? "дерево" : treeCount < 5 ? "дерева" : "деревьев"}`
                  : `Купить ${treeCount} ${treeCount === 1 ? "дерево" : treeCount < 5 ? "дерева" : "деревьев"} от "${enterpriseName || "предприятия"}"`}
            </button>
          </div>
        </div>

        {/* Информация о процессе */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Как это работает:</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                1
              </span>
              <p>Вы покупаете NFT сертификаты деревьев по 0.01 ETH за штуку</p>
            </div>
            <div className="flex items-start">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                2
              </span>
              <p>Исполнитель сажает деревья и отправляет доказательства</p>
            </div>
            <div className="flex items-start">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                3
              </span>
              <p>Мы верифицируем посадку и записываем в блокчейн</p>
            </div>
            <div className="flex items-start">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                4
              </span>
              <p>
                Вы получаете NFT сертификаты с геопривязкой
                {donorType === "enterprise" && " и названием вашего предприятия"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorPage;
