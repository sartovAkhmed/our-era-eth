"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface Tree {
  id: number;
  treeCount: number;
  location: string;
  donor: string;
  executor: string;
  isVerified: boolean;
  plantedAt: number;
  donationAmount: string;
}

const AvailableTrees = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

  // Читаем статистику платформы для получения общего количества деревьев
  const { data: platformStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getPlatformStats",
  });

  // Загружаем доступные деревья
  useEffect(() => {
    const loadTrees = async () => {
      if (!platformStats) return;

      const totalTrees = Number(platformStats[0]) || 0;
      const availableTrees: Tree[] = [];

      // Загружаем информацию о каждом дереве
      for (let i = 1; i <= totalTrees; i++) {
        try {
          // В реальном приложении здесь был бы вызов getTree
          // Пока что создаем тестовые данные с правильной структурой
          const mockTree: Tree = {
            id: i,
            treeCount: Math.floor(Math.random() * 5) + 1, // 1-5 деревьев
            location: [
              "Москва, парк Сокольники",
              "Санкт-Петербург, Летний сад",
              "Казань, парк Горького",
              "Сочи, дендрарий",
              "Екатеринбург, Харитоновский парк",
            ][i % 5],
            donor: `0x${Math.random().toString(16).substr(2, 8)}...`,
            executor:
              i % 3 === 0
                ? `0x${Math.random().toString(16).substr(2, 8)}...`
                : "0x0000000000000000000000000000000000000000",
            isVerified: i % 4 === 0,
            plantedAt: i % 3 === 0 ? Date.now() / 1000 : 0,
            donationAmount: ((Math.floor(Math.random() * 5) + 1) * 0.01).toFixed(3) + " ETH",
          };
          availableTrees.push(mockTree);
        } catch (error) {
          console.error(`Ошибка загрузки дерева ${i}:`, error);
        }
      }

      setTrees(availableTrees);
      setLoading(false);
    };

    loadTrees();
  }, [platformStats]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">🌳 Доступные деревья для посадки</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  const availableTrees = trees.filter(
    tree => tree.executor === "0x0000000000000000000000000000000000000000" && !tree.isVerified,
  );

  const totalTreesCount = trees.reduce((sum, tree) => sum + tree.treeCount, 0);
  const availableTreesCount = availableTrees.reduce((sum, tree) => sum + tree.treeCount, 0);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">🌳 Доступные деревья для посадки</h3>

      {availableTrees.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🌱</div>
          <p className="text-gray-600">Нет доступных деревьев для посадки</p>
          <p className="text-sm text-gray-500 mt-1">Деревья появятся здесь после покупки донорами</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {availableTrees.map(tree => (
            <div key={tree.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-green-800">Заказ #{tree.id}</div>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {tree.treeCount} {tree.treeCount === 1 ? "дерево" : tree.treeCount < 5 ? "дерева" : "деревьев"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">{tree.location}</div>
                  <div className="text-xs text-gray-500 mb-1">Донор: {tree.donor}</div>
                  <div className="text-xs text-green-600 font-medium">
                    Награда: {(tree.treeCount * 0.008).toFixed(4)} ETH
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Доступно
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-gray-800">{totalTreesCount}</div>
            <div className="text-gray-500">Всего деревьев</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">{availableTreesCount}</div>
            <div className="text-gray-500">Доступно для посадки</div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          {availableTrees.length} заказ(ов) • {availableTreesCount} деревьев
        </div>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
        <div className="text-sm text-yellow-800">
          <div className="font-semibold mb-1">💡 Как посадить дерево?</div>
          <ul className="space-y-1 text-xs">
            <li>• Выберите заказ из списка выше</li>
            <li>• Запомните ID заказа</li>
            <li>• Перейдите на страницу исполнителя</li>
            <li>• Введите ID и загрузите доказательства посадки</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AvailableTrees;
