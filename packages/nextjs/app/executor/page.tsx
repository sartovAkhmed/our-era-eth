"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { CameraIcon, DocumentTextIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const ExecutorPage = () => {
  const { address: connectedAddress } = useAccount();
  const [treeId, setTreeId] = useState("");
  const [imageHash, setImageHash] = useState("");
  const [documentHash, setDocumentHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableTrees, setAvailableTrees] = useState<any[]>([]);
  const [selectedTree, setSelectedTree] = useState<any>(null);
  const [showAvailableTrees, setShowAvailableTrees] = useState(false);

  // Читаем статистику пользователя
  const { data: userStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getUserStats",
    args: [connectedAddress],
  });

  // Хук для посадки дерева
  const { writeContractAsync: plantTreeAsync } = useScaffoldWriteContract({
    contractName: "TreeChain",
  });

  // Функция для получения доступных деревьев (симуляция)
  const loadAvailableTrees = async () => {
    // В реальном приложении здесь был бы запрос к API или смарт-контракту
    // Пока что создаем тестовые данные
    const mockTrees = [
      { id: 1, species: "Дуб", location: "Москва, парк Сокольники", donor: "0x123...", status: "available" },
      { id: 2, species: "Сосна", location: "Санкт-Петербург, Летний сад", donor: "0x456...", status: "available" },
      { id: 3, species: "Береза", location: "Казань, парк Горького", donor: "0x789...", status: "available" },
    ];
    setAvailableTrees(mockTrees);
  };

  // Функция для загрузки файла в IPFS (симуляция)
  const uploadToIPFS = async (file: File): Promise<string> => {
    // В реальном приложении здесь была бы интеграция с IPFS
    // Пока что возвращаем случайный хеш
    const randomHash = "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return randomHash;
  };

  // Обработчик выбора файла изображения
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const hash = await uploadToIPFS(file);
        setImageHash(hash);
        alert(`Фотография загружена! IPFS хеш: ${hash}`);
      } catch (error) {
        alert("Ошибка при загрузке фотографии");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Обработчик выбора файла документов
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const hash = await uploadToIPFS(file);
        setDocumentHash(hash);
        alert(`Документы загружены! IPFS хеш: ${hash}`);
      } catch (error) {
        alert("Ошибка при загрузке документов");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Обработчик выбора дерева
  const handleTreeSelect = (tree: any) => {
    setTreeId(tree.id.toString());
    setSelectedTree(tree);
    setShowAvailableTrees(false);
  };

  // Загружаем доступные деревья при монтировании компонента
  useEffect(() => {
    loadAvailableTrees();
  }, []);

  const handlePlantTree = async () => {
    if (!treeId || !imageHash || !documentHash) {
      alert("Пожалуйста, заполните все поля");
      return;
    }

    setIsLoading(true);
    try {
      await plantTreeAsync({
        functionName: "plantTree",
        args: [BigInt(treeId), imageHash, documentHash],
      });

      alert("Отчет о посадке отправлен! Ожидайте верификации.");
      setTreeId("");
      setImageHash("");
      setDocumentHash("");
    } catch (error) {
      console.error("Ошибка при отправке отчета:", error);
      alert("Ошибка при отправке отчета. Проверьте консоль для подробностей.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!connectedAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Подключите кошелек</h1>
          <p className="text-gray-600">Для работы исполнителем необходимо подключить кошелек</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">Исполнитель</h1>
          <p className="text-lg text-gray-600">Сажайте деревья и получайте награды в токенах</p>
        </div>

        {/* Статистика пользователя */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-100 p-6 rounded-lg text-center">
              <div className="text-4xl mb-2">🌳</div>
              <p className="text-2xl font-bold text-green-600">{userStats[1]?.toString() || "0"}</p>
              <p className="text-sm text-gray-600">Деревьев посажено</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{((Number(userStats[1]) || 0) * 0.008).toFixed(4)} ETH</p>
              <p className="text-sm text-gray-600">Заработано награды</p>
            </div>
          </div>
        )}

        {/* Форма посадки */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Отправить отчет о посадке</h2>

          <div className="space-y-6">
            {/* Выбор дерева */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Выберите дерево для посадки *</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={treeId}
                    onChange={e => setTreeId(e.target.value)}
                    placeholder="ID дерева или выберите из списка"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAvailableTrees(!showAvailableTrees)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <EyeIcon className="h-4 w-4" />
                    Выбрать
                  </button>
                </div>

                {showAvailableTrees && (
                  <div className="border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                    {availableTrees.map(tree => (
                      <div
                        key={tree.id}
                        onClick={() => handleTreeSelect(tree)}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0"
                      >
                        <div className="font-medium">
                          Дерево #{tree.id} - {tree.species}
                        </div>
                        <div className="text-sm text-gray-600">{tree.location}</div>
                        <div className="text-xs text-gray-500">Донор: {tree.donor}</div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedTree && (
                  <div className="p-3 bg-green-50 rounded-md">
                    <div className="font-medium text-green-800">
                      Выбрано: Дерево #{selectedTree.id} - {selectedTree.species}
                    </div>
                    <div className="text-sm text-green-600">{selectedTree.location}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Загрузка фотографии */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Фотография посадки *</label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CameraIcon className="h-5 w-5 text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {imageHash && (
                  <div className="p-2 bg-green-50 rounded text-sm">
                    <span className="font-medium">IPFS хеш:</span> {imageHash}
                  </div>
                )}
              </div>
            </div>

            {/* Загрузка документов */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Документы (координаты, сертификат) *
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleDocumentUpload}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {documentHash && (
                  <div className="p-2 bg-green-50 rounded text-sm">
                    <span className="font-medium">IPFS хеш:</span> {documentHash}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Награда за посадку:</h3>
              <p className="text-lg font-bold text-green-600">0.008 ETH</p>
              <p className="text-sm text-gray-600 mt-1">Награда будет выплачена после верификации посадки</p>
            </div>

            <button
              onClick={handlePlantTree}
              disabled={isLoading || !treeId || !imageHash || !documentHash}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Отправка..." : "Отправить отчет"}
            </button>
          </div>
        </div>

        {/* Инструкции */}
        <div className="mt-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Как получить данные для полей:</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🌳 ID дерева</h4>
              <p className="text-sm text-gray-700 mb-2">Способы получения ID дерева:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Используйте кнопку "Выбрать" для просмотра доступных деревьев</li>
                <li>• Получите ID от донора, который купил дерево</li>
                <li>• Обратитесь к администратору платформы</li>
                <li>• Проверьте страницу отладки для просмотра всех деревьев</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">📷 IPFS хеш фотографии</h4>
              <p className="text-sm text-gray-700 mb-2">Загрузите фотографию посадки:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Сделайте фото посаженного дерева</li>
                <li>• Используйте поле "Фотография посадки" для загрузки</li>
                <li>• Система автоматически загрузит файл в IPFS</li>
                <li>• Вы получите IPFS хеш для записи в блокчейн</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">📄 IPFS хеш документов</h4>
              <p className="text-sm text-gray-700 mb-2">Загрузите документы с координатами:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Создайте документ с GPS координатами посадки</li>
                <li>• Добавьте сертификат или другие подтверждающие документы</li>
                <li>• Используйте поле "Документы" для загрузки</li>
                <li>• Система автоматически загрузит файл в IPFS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutorPage;
