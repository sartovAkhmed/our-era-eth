"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { CurrencyDollarIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const DonorPage = () => {
  const { address: connectedAddress } = useAccount();
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Читаем статистику пользователя
  const { data: userStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getUserStats",
    args: [connectedAddress],
  });

  // Читаем цену дерева
  const { data: treePrice } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "TREE_PRICE",
  });

  // Хук для покупки дерева
  const { writeContractAsync: purchaseTreeAsync } = useScaffoldWriteContract({
    contractName: "TreeChain",
  });

  const handlePurchaseTree = async () => {
    if (!species || !location) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    if (!treePrice) {
      alert("Не удалось получить цену дерева");
      return;
    }

    setIsLoading(true);
    try {
      await purchaseTreeAsync({
        functionName: "purchaseTree",
        args: [species, location],
        value: treePrice,
      });

      alert("Дерево успешно куплено! Вы получили NFT сертификат.");
      setSpecies("");
      setLocation("");
    } catch (error) {
      console.error("Ошибка при покупке дерева:", error);
      alert("Ошибка при покупке дерева. Проверьте консоль для подробностей.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h1 className="text-4xl font-bold text-green-600 mb-4">🌳 Покупка дерева</h1>
          <p className="text-lg text-gray-600">Поддержите экологические проекты, купив NFT сертификат дерева</p>
        </div>

        {/* Статистика пользователя */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-100 p-6 rounded-lg text-center">
              <div className="text-4xl mb-2">🌳</div>
              <p className="text-2xl font-bold text-green-600">{userStats[0]?.toString() || "0"}</p>
              <p className="text-sm text-gray-600">Деревьев пожертвовано</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg text-center">
              <CurrencyDollarIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <p className="text-2xl font-bold text-blue-600">{((Number(userStats[0]) || 0) * 0.01).toFixed(2)} ETH</p>
              <p className="text-sm text-gray-600">Потрачено на деревья</p>
            </div>
          </div>
        )}

        {/* Форма покупки */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Купить дерево</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Вид дерева *</label>
              <input
                type="text"
                value={species}
                onChange={e => setSpecies(e.target.value)}
                placeholder="Например: Дуб, Сосна, Береза..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Местоположение для посадки *</label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Например: Москва, парк Сокольники"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Стоимость:</h3>
              <p className="text-lg font-bold text-green-600">
                {treePrice ? `${(Number(treePrice) / 1e18).toFixed(4)} ETH` : "Загрузка..."}
              </p>
              <p className="text-sm text-gray-600 mt-1">Включает: посадку дерева, NFT сертификат, верификацию</p>
            </div>

            <button
              onClick={handlePurchaseTree}
              disabled={isLoading || !species || !location}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Покупка..." : "Купить дерево"}
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
              <p>Вы покупаете NFT сертификат дерева за 0.01 ETH</p>
            </div>
            <div className="flex items-start">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                2
              </span>
              <p>Исполнитель сажает дерево и отправляет доказательства</p>
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
              <p>Вы получаете NFT сертификат с геопривязкой</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorPage;
