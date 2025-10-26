"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { CheckIcon, EyeIcon, ShieldCheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const AdminPage = () => {
  const { address: connectedAddress } = useAccount();
  const [selectedTreeId, setSelectedTreeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Read tree info
  const { data: treeData, refetch: refetchTree } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getTree",
    args: selectedTreeId ? [BigInt(selectedTreeId)] : undefined,
  });

  // Hook for tree verification
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

      alert(`Tree ${approved ? "approved" : "rejected"}!`);
      refetchTree();
    } catch (error) {
      console.error("Error during verification:", error);
      alert("Verification error. Check the console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is contract owner
  const { data: owner } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "owner",
  });

  const isAdmin = connectedAddress && owner && connectedAddress.toLowerCase() === owner.toLowerCase();

  if (!connectedAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect your wallet</h1>
          <p className="text-gray-600">You need to connect your wallet to access the admin panel</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access denied</h1>
          <p className="text-gray-600">Only the contract owner can access the admin panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-600 mb-4">🛡️ Admin Panel</h1>
          <p className="text-lg text-gray-600">Tree planting verification and platform management</p>
        </div>

        {/* Tree search */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Tree Verification</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tree ID for verification</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={selectedTreeId}
                  onChange={e => setSelectedTreeId(e.target.value)}
                  placeholder="Enter tree ID"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => refetchTree()}
                  className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors"
                >
                  <EyeIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Tree info */}
            {treeData && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Tree information #{selectedTreeId}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <strong>Tree count:</strong> {treeData.treeCount?.toString()}
                    </p>
                    <p>
                      <strong>Location:</strong> {treeData.location}
                    </p>
                    <p>
                      <strong>Donor:</strong> {treeData.donor}
                    </p>
                    <p>
                      <strong>Executor:</strong> {treeData.executor}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Donation amount:</strong> {(Number(treeData.donationAmount) / 1e18).toFixed(4)} ETH
                    </p>
                    <p>
                      <strong>Executor reward:</strong> {(Number(treeData.rewardAmount) / 1e18).toFixed(4)} ETH
                    </p>
                    <p>
                      <strong>Status:</strong> {treeData.isVerified ? "✅ Verified" : "⏳ Awaiting verification"}
                    </p>
                    <p>
                      <strong>Planted at:</strong>{" "}
                      {treeData.plantedAt
                        ? new Date(Number(treeData.plantedAt) * 1000).toLocaleString()
                        : "Not planted"}
                    </p>
                  </div>
                </div>

                {treeData.imageHash && (
                  <div className="mt-4">
                    <p>
                      <strong>IPFS photo hash:</strong>
                    </p>
                    <p className="text-sm text-gray-600 break-all">{treeData.imageHash}</p>
                  </div>
                )}

                {treeData.documentHash && (
                  <div className="mt-2">
                    <p>
                      <strong>IPFS document hash:</strong>
                    </p>
                    <p className="text-sm text-gray-600 break-all">{treeData.documentHash}</p>
                  </div>
                )}

                {/* Verification buttons */}
                {!treeData.isVerified && treeData.executor !== "0x0000000000000000000000000000000000000000" && (
                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => handleVerifyTree(true)}
                      disabled={isLoading}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="h-5 w-5" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleVerifyTree(false)}
                      disabled={isLoading}
                      className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-red-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Platform statistics */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Platform statistics</h3>
          <p className="text-gray-600">Use the debug page to view full statistics and manage contracts</p>
          <div className="mt-4">
            <a
              href="/debug"
              className="bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
            >
              <EyeIcon className="h-5 w-5" />
              Open debug
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
