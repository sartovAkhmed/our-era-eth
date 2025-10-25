"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Heart, 
  TreePine, 
  Wallet, 
  Award, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock,
  Star,
  Plus,
  Eye,
  Share2,
  QrCode,
  TrendingUp,
  Globe,
  Shield,
  Sprout,
  ArrowRight,
  Filter,
  Search,
  Grid,
  List
} from "lucide-react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

const DonorDashboard = () => {
  const { address: connectedAddress } = useAccount();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showBuyTree, setShowBuyTree] = useState(false);

  const { data: userStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getUserStats",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Mock data for NFT collection
  const nftCollection = [
    {
      id: "TREE-001",
      image: "/api/placeholder/300/200",
      location: "Amazon Rainforest, Brazil",
      species: "Brazilian Rosewood",
      plantedDate: "2024-01-15",
      status: "verified",
      co2Impact: 22,
      coordinates: { lat: -3.4653, lng: -62.2159 },
      qrCode: "treechain://tree/TREE-001"
    },
    {
      id: "TREE-002",
      image: "/api/placeholder/300/200",
      location: "Congo Basin, Africa",
      species: "African Mahogany",
      plantedDate: "2024-01-20",
      status: "planted",
      co2Impact: 25,
      coordinates: { lat: 0.2280, lng: 20.8783 },
      qrCode: "treechain://tree/TREE-002"
    },
    {
      id: "TREE-003",
      image: "/api/placeholder/300/200",
      location: "Borneo, Indonesia",
      species: "Dipterocarp",
      plantedDate: "2024-01-25",
      status: "pending",
      co2Impact: 20,
      coordinates: { lat: 0.7893, lng: 113.9213 },
      qrCode: "treechain://tree/TREE-003"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-emerald-100 text-emerald-800";
      case "planted": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle className="w-4 h-4" />;
      case "planted": return <Sprout className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Calculate profile badge
  const treeCount = Number(userStats?.[0]) || 0;
  const getBadgeLevel = () => {
    if (treeCount >= 100) return { level: "Forest Guardian", color: "from-purple-500 to-indigo-600", icon: Award };
    if (treeCount >= 50) return { level: "Tree Champion", color: "from-blue-500 to-cyan-600", icon: Star };
    if (treeCount >= 20) return { level: "Sapling Supporter", color: "from-green-500 to-emerald-600", icon: Sprout };
    return { level: "Seedling", color: "from-amber-500 to-orange-600", icon: Heart };
  };

  const badge = getBadgeLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-forest-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Profile Badge & Wallet */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Badge */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
              <div className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${badge.color} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
                  <badge.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-forest-900 mb-2">{badge.level}</h3>
                <p className="text-forest-600 mb-4">Your environmental impact level</p>
                <div className="bg-emerald-50 rounded-2xl p-4">
                  <div className="text-3xl font-bold text-emerald-600">{treeCount}</div>
                  <div className="text-emerald-600 font-semibold">Trees Supported</div>
                </div>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-forest-900 mb-2">1,250</div>
              <div className="text-emerald-600 font-semibold">Reward Tokens</div>
              <div className="text-forest-600 text-sm mt-2">Available balance</div>
            </div>

            {/* Impact Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-forest-900 mb-2">
                {(treeCount * 22).toLocaleString()}
              </div>
              <div className="text-emerald-600 font-semibold">CO₂ Reduced (kg)</div>
              <div className="text-forest-600 text-sm mt-2">Annual impact</div>
            </div>
          </div>

          {/* NFT Collection Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-forest-900">My Tree Collection</h2>
              <p className="text-forest-600 mt-2">Your verified tree NFT certificates</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 border border-emerald-200">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-colors ${viewMode === "grid" ? "bg-emerald-100 text-emerald-600" : "text-forest-600 hover:bg-emerald-50"}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-colors ${viewMode === "list" ? "bg-emerald-100 text-emerald-600" : "text-forest-600 hover:bg-emerald-50"}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              <button
                onClick={() => setShowBuyTree(true)}
                className="bg-gradient-to-r from-emerald-500 to-forest-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Buy New Tree</span>
              </button>
            </div>
          </div>

          {/* NFT Collection */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nftCollection.map((nft) => (
                <div key={nft.id} className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-emerald-200 hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-emerald-100 to-forest-100 flex items-center justify-center">
                      <TreePine className="w-16 h-16 text-emerald-600" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(nft.status)}`}>
                        {getStatusIcon(nft.status)}
                        <span className="capitalize">{nft.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-forest-900">{nft.id}</h3>
                      <button className="p-2 hover:bg-emerald-100 rounded-xl transition-colors">
                        <Share2 className="w-4 h-4 text-emerald-600" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="text-forest-700 text-sm">{nft.location}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span className="text-forest-700 text-sm">Planted: {nft.plantedDate}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="text-forest-700 text-sm">{nft.co2Impact} kg CO₂/year</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6">
                      <button className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span className="font-medium">View Details</span>
                      </button>
                      <button className="p-2 hover:bg-emerald-100 rounded-xl transition-colors">
                        <QrCode className="w-4 h-4 text-emerald-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
              <div className="space-y-4">
                {nftCollection.map((nft) => (
                  <div key={nft.id} className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200 hover:bg-emerald-100/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-forest-100 rounded-2xl flex items-center justify-center">
                          <TreePine className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-forest-900">{nft.id}</h3>
                          <div className="flex items-center space-x-2 text-forest-600 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{nft.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-sm text-forest-600">Status</div>
                          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(nft.status)}`}>
                            {getStatusIcon(nft.status)}
                            <span className="capitalize">{nft.status}</span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-forest-600">CO₂ Impact</div>
                          <div className="font-semibold text-forest-900">{nft.co2Impact} kg/year</div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="p-2 hover:bg-emerald-100 rounded-xl transition-colors">
                            <Eye className="w-4 h-4 text-emerald-600" />
                          </button>
                          <button className="p-2 hover:bg-emerald-100 rounded-xl transition-colors">
                            <Share2 className="w-4 h-4 text-emerald-600" />
                          </button>
                          <button className="p-2 hover:bg-emerald-100 rounded-xl transition-colors">
                            <QrCode className="w-4 h-4 text-emerald-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Buy Tree Modal */}
      {showBuyTree && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-forest-900">Buy New Tree</h3>
              <button
                onClick={() => setShowBuyTree(false)}
                className="text-forest-400 hover:text-forest-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                  <h4 className="font-semibold text-forest-900 mb-2">Single Tree</h4>
                  <div className="text-2xl font-bold text-emerald-600 mb-2">$5</div>
                  <p className="text-forest-600 text-sm">One verified tree NFT</p>
                </div>
                
                <div className="bg-forest-50 rounded-2xl p-6 border border-forest-200">
                  <h4 className="font-semibold text-forest-900 mb-2">Tree Pack (10)</h4>
                  <div className="text-2xl font-bold text-forest-600 mb-2">$45</div>
                  <p className="text-forest-600 text-sm">10 trees with 10% discount</p>
                </div>
              </div>
              
              <div>
                <label className="block text-forest-700 font-semibold mb-2">Tree Species</label>
                <select className="w-full px-4 py-3 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Brazilian Rosewood</option>
                  <option>African Mahogany</option>
                  <option>Dipterocarp</option>
                  <option>Oak</option>
                  <option>Pine</option>
                </select>
              </div>
              
              <div>
                <label className="block text-forest-700 font-semibold mb-2">Planting Location</label>
                <select className="w-full px-4 py-3 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option>Amazon Rainforest, Brazil</option>
                  <option>Congo Basin, Africa</option>
                  <option>Borneo, Indonesia</option>
                  <option>Pacific Northwest, USA</option>
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowBuyTree(false)}
                className="px-6 py-3 border border-emerald-200 rounded-2xl text-forest-700 hover:bg-emerald-50 transition-colors"
              >
                Cancel
              </button>
              <button className="bg-gradient-to-r from-emerald-500 to-forest-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Purchase Tree</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonorDashboard;