"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { CheckIcon, EyeIcon, ShieldCheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const AdminPage = () => {
  const { address: connectedAddress } = useAccount();
  const [selectedTreeId, setSelectedTreeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Читаем информацию о дереве
  const { data: treeData, refetch: refetchTree } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getTree",
    args: selectedTreeId ? [BigInt(selectedTreeId)] : undefined,
  });

  // Хук для верификации дерева
  const { writeContractAsync: verifyTreeAsync } = useScaffoldWriteContract({
    contractName: "TreeChain",
  });

  const handleVerifyTree = async (approved: boolean) => {
    if (!selectedTreeId) return;

    setIsLoading(true);
    try {
      await verifyTreeAsync({
        functionName: "verifyTree",
        args: [BigInt(selectedTreeId), approved],
      });

      alert(`Дерево ${approved ? "одобрено" : "отклонено"}!`);
      refetchTree();
    } catch (error) {
      console.error("Ошибка при верификации:", error);
      alert("Ошибка при верификации. Проверьте консоль для подробностей.");
    } finally {
      setIsLoading(false);
    }
  };

  // Проверяем, является ли пользователь владельцем контракта
  const { data: owner } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "owner",
  });

  const isAdmin = connectedAddress && owner && connectedAddress.toLowerCase() === owner.toLowerCase();

  if (!connectedAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Подключите кошелек</h1>
          <p className="text-gray-600">Для доступа к админ-панели необходимо подключить кошелек</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Доступ запрещен</h1>
          <p className="text-gray-600">Только владелец контракта может получить доступ к админ-панели</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <ShieldCheckIcon className="h-16 w-16 mx-auto mb-4 text-blue-500" />
          <h1 className="text-4xl font-bold text-blue-600 mb-4">🛡️ Админ-панель</h1>
          <p className="text-lg text-gray-600">Верификация посадок деревьев и управление платформой</p>
        </div>

        {/* Поиск дерева */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Верификация дерева</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ID дерева для верификации</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={selectedTreeId}
                  onChange={e => setSelectedTreeId(e.target.value)}
                  placeholder="Введите ID дерева"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => refetchTree()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Информация о дереве */}
            {treeData && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Информация о дереве #{selectedTreeId}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Количество деревьев:</strong> {treeData.treeCount?.toString()}
                    </p>
                    <p>
                      <strong>Местоположение:</strong> {treeData.location}
                    </p>
                    <p>
                      <strong>Донор:</strong> {treeData.donor}
                    </p>
                    <p>
                      <strong>Исполнитель:</strong> {treeData.executor}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Сумма пожертвования:</strong> {(Number(treeData.donationAmount) / 1e18).toFixed(4)} ETH
                    </p>
                    <p>
                      <strong>Награда исполнителю:</strong> {(Number(treeData.rewardAmount) / 1e18).toFixed(4)} ETH
                    </p>
                    <p>
                      <strong>Статус:</strong> {treeData.isVerified ? "✅ Верифицировано" : "⏳ Ожидает верификации"}
                    </p>
                    <p>
                      <strong>Посажено:</strong>{" "}
                      {treeData.plantedAt
                        ? new Date(Number(treeData.plantedAt) * 1000).toLocaleString()
                        : "Не посажено"}
                    </p>
                  </div>
                </div>

                {treeData.imageHash && (
                  <div className="mt-4">
                    <p>
                      <strong>IPFS хеш фотографии:</strong>
                    </p>
                    <p className="text-sm text-gray-600 break-all">{treeData.imageHash}</p>
                  </div>
                )}

                {treeData.documentHash && (
                  <div className="mt-2">
                    <p>
                      <strong>IPFS хеш документов:</strong>
                    </p>
                    <p className="text-sm text-gray-600 break-all">{treeData.documentHash}</p>
                  </div>
                )}

                {/* Кнопки верификации */}
                {!treeData.isVerified && treeData.executor !== "0x0000000000000000000000000000000000000000" && (
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => handleVerifyTree(true)}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="h-5 w-5" />
                      Одобрить
                    </button>
                    <button
                      onClick={() => handleVerifyTree(false)}
                      disabled={isLoading}
                      className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      Отклонить
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Статистика платформы */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Статистика платформы</h3>
          <p className="text-gray-600">
            Используйте страницу отладки для просмотра полной статистики и управления контрактами
          </p>
          <div className="mt-4">
            <a
              href="/debug"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <EyeIcon className="h-5 w-5" />
              Открыть отладку
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
