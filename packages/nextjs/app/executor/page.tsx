"use client";

import { useEffect, useState } from "react";
import logo from "../../public/tree.png";
import { RefreshCwIcon } from "lucide-react";
import { useAccount } from "wagmi";
import { CameraIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const ExecutorPage = () => {
  const { address: connectedAddress } = useAccount();
  const [treeId, setTreeId] = useState("");
  const [imageHash, setImageHash] = useState("");
  const [documentHash, setDocumentHash] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTree, setSelectedTree] = useState<any>(null);

  // Read user stats
  const { data: userStats, refetch: refetchUserStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getUserStats",
    args: [connectedAddress],
  });

  // Hook for planting a tree
  const { writeContractAsync: plantTreeAsync } = useScaffoldWriteContract({
    contractName: "TreeChain",
  });

  // Function to fetch information about a specific tree
  const { data: treeData, refetch: refetchTree } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getTree",
    args: treeId ? [BigInt(treeId)] : undefined,
  });

  // Function to upload a file to IPFS (simulation)
  const uploadToIPFS = async (file: File): Promise<string> => {
    const randomHash = "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return randomHash;
  };

  // Image file upload handler
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const hash = await uploadToIPFS(file);
        setImageHash(hash);
        alert(`Photo uploaded! IPFS hash: ${hash}`);
      } catch (error) {
        alert("Error uploading photo");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Document file upload handler
  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const hash = await uploadToIPFS(file);
        setDocumentHash(hash);
        alert(`Documents uploaded! IPFS hash: ${hash}`);
      } catch (error) {
        alert("Error uploading documents");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Обработчик ручного ввода ID дерева
  const handleTreeIdChange = (value: string) => {
    setTreeId(value);
    setSelectedTree(null);
    if (value) {
      // If an ID is entered, try to fetch the tree data
      refetchTree();
    }
  };

  // Обновляем выбранное дерево при загрузке данных
  useEffect(() => {
    if (treeData && treeId) {
      setSelectedTree({
        id: parseInt(treeId),
        treeCount: treeData.treeCount?.toString() || "1",
        location: treeData.location,
        donor: treeData.donor,
        donationAmount: treeData.donationAmount ? (Number(treeData.donationAmount) / 1e18).toFixed(4) + " ETH" : "N/A",
        executor: treeData.executor,
        isVerified: treeData.isVerified,
      });
    }
  }, [treeData, treeId]);

  const handlePlantTree = async () => {
    if (!treeId || !imageHash || !documentHash) {
      alert("Please fill in all fields");
      return;
    }

    if (selectedTree?.executor && selectedTree.executor !== "0x0000000000000000000000000000000000000000") {
      alert("This tree has already been planted by another executor");
      return;
    }

    if (selectedTree?.isVerified) {
      alert("This tree has already been verified");
      return;
    }

    setIsLoading(true);
    try {
      await plantTreeAsync({
        functionName: "plantTree",
        args: [BigInt(treeId), imageHash, documentHash],
      });

      alert("Planting report submitted! Please wait for verification.");
      setTreeId("");
      setImageHash("");
      setDocumentHash("");
      setSelectedTree(null);
      refetchUserStats();
    } catch (error) {
      console.error("Ошибка при отправке отчета:", error);
      alert("Error submitting the report. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!connectedAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect your wallet</h1>
          <p className="text-gray-600">To work as an executor you need to connect your wallet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-4xl font-bold text-green-600 mb-4">Executor</h1>
          <p className="text-lg text-gray-600">Plant trees and earn rewards in ETH</p>
        </div>

        {/* Статистика пользователя */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-green-100 p-6 rounded-lg text-center">
              <p className="text-6xl font-bold text-green-600">{userStats[1]?.toString() || "0"}</p>
              <p className=" text-gray-600 text-2xl font-bold">Trees planted</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg text-center">
              <p className="text-6xl font-bold text-blue-600">{((Number(userStats[1]) || 0) * 0.008).toFixed(4)} ETH</p>
              <p className="text-2xl font-bold text-gray-600">Rewards earned</p>
            </div>
          </div>
        )}

        {/* Форма посадки */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Submit planting report</h2>

          <div className="space-y-6">
            {/* Выбор дерева */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tree ID for planting *</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={treeId}
                    onChange={e => handleTreeIdChange(e.target.value)}
                    placeholder="Enter tree ID provided by the donor"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => refetchTree()}
                    disabled={!treeId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <RefreshCwIcon className="h-4 w-4" />
                    Check
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  The tree ID must be provided by the donor who purchased the tree
                </p>

                {selectedTree && (
                  <div className="p-3 bg-green-50 rounded-md">
                    <div className="font-medium text-green-800">
                      Tree information #{selectedTree.id} - {selectedTree.treeCount} trees
                    </div>
                    <div className="text-sm text-green-600">{selectedTree.location}</div>
                    <div className="text-xs text-green-500">
                      Донор: {selectedTree.donor} • Сумма: {selectedTree.donationAmount}
                    </div>
                    {selectedTree.executor &&
                      selectedTree.executor !== "0x0000000000000000000000000000000000000000" && (
                        <div className="text-xs text-red-500 mt-1">
                          ⚠️ Already planted by executor: {selectedTree.executor}
                        </div>
                      )}
                    {selectedTree.isVerified && (
                      <div className="text-xs text-red-500 mt-1">⚠️ This tree is already verified</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Загрузка фотографии */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Planting photo *</label>
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
                    <span className="font-medium">IPFS hash:</span> {imageHash}
                  </div>
                )}
              </div>
            </div>

            {/* Загрузка документов */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents (coordinates, certificate) *
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
                    <span className="font-medium">IPFS hash:</span> {documentHash}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Reward for planting:</h3>
              <p className="text-lg font-bold text-green-600">
                {selectedTree ? (Number(selectedTree.treeCount) * 0.008).toFixed(4) : "0.008"} ETH
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {selectedTree ? `For ${selectedTree.treeCount} trees` : "For one tree"}. Reward will be paid after
                verification of the planting
              </p>
            </div>

            <button
              onClick={handlePlantTree}
              disabled={
                isLoading ||
                !treeId ||
                !imageHash ||
                !documentHash ||
                (selectedTree?.executor && selectedTree.executor !== "0x0000000000000000000000000000000000000000") ||
                selectedTree?.isVerified
              }
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Submitting..." : "Submit report"}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">How to get data for the fields:</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">🌳 Tree ID</h4>
              <p className="text-sm text-gray-700 mb-2">Ways to get the tree ID:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Get the ID from the donor who purchased the tree</li>
                <li>• Contact the platform administrator</li>
                <li>• Verify the ID using the "Check" button</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">📷 IPFS hash for photo</h4>
              <p className="text-sm text-gray-700 mb-2">Upload the planting photo:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Take a photo of the planted tree</li>
                <li>• Use the "Planting photo" field to upload</li>
                <li>• The system will automatically upload the file to IPFS</li>
                <li>• You will receive an IPFS hash to record on the blockchain</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">📄 IPFS hash for documents</h4>
              <p className="text-sm text-gray-700 mb-2">Upload documents with coordinates:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Create a document with GPS coordinates of the planting site</li>
                <li>• Add a certificate or other supporting documents</li>
                <li>• Use the "Documents" field to upload</li>
                <li>• The system will automatically upload the file to IPFS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutorPage;
