"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

interface Tree {
  id: number;
  species: string;
  location: string;
  donor: string;
  executor: string;
  isVerified: boolean;
  plantedAt: number;
}

const AvailableTrees = () => {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);

  // Read platform statistics to get total number of trees
  const { data: platformStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getPlatformStats",
  });

  // Load available trees
  useEffect(() => {
    const loadTrees = async () => {
      if (!platformStats) return;

      const totalTrees = Number(platformStats[0]) || 0;
      const availableTrees: Tree[] = [];

      // Load information about each tree
      for (let i = 1; i <= totalTrees; i++) {
        try {
          // In a real application, there would be a getTree call here
          // For now, creating test data
          const mockTree: Tree = {
            id: i,
            species: ["Oak", "Pine", "Birch", "Maple", "Linden"][i % 5],
            location: `Location ${i}`,
            donor: `0x${Math.random().toString(16).substr(2, 8)}...`,
            executor:
              i % 3 === 0
                ? `0x${Math.random().toString(16).substr(2, 8)}...`
                : "0x0000000000000000000000000000000000000000",
            isVerified: i % 4 === 0,
            plantedAt: i % 3 === 0 ? Date.now() / 1000 : 0,
          };
          availableTrees.push(mockTree);
        } catch (error) {
          console.error(`Error loading tree ${i}:`, error);
        }
      }

      setTrees(availableTrees);
      setLoading(false);
    };

    loadTrees();
  }, [platformStats]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Available trees for planting</h3>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const availableTrees = trees.filter(
    tree => tree.executor === "0x0000000000000000000000000000000000000000" && !tree.isVerified,
  );

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">🌳 Available trees for planting</h3>

      {availableTrees.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🌱</div>
          <p className="text-gray-600">No available trees for planting</p>
          <p className="text-sm text-gray-500 mt-1">Trees will appear here after donors purchase them</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {availableTrees.map(tree => (
            <div key={tree.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-green-800">
                    Tree #{tree.id} - {tree.species}
                  </div>
                  <div className="text-sm text-gray-600">{tree.location}</div>
                  <div className="text-xs text-gray-500">Donor: {tree.donor}</div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Available
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Total trees: {trees.length} | Available for planting: {availableTrees.length}
      </div>
    </div>
  );
};

export default AvailableTrees;
