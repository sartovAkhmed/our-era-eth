"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  BarChart3, 
  Building2, 
  Calendar, 
  CheckCircle, 
  FileText, 
  Globe, 
  Home, 
  MapPin, 
  Plus, 
  Settings, 
  TreePine, 
  TrendingUp,
  Users,
  Wallet,
  Award,
  Clock,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

const BusinessDashboard = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateOrder, setShowCreateOrder] = useState(false);

  const { data: platformStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getPlatformStats",
  });

  const { data: userStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getUserStats",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Mock data for orders
  const orders = [
    {
      id: "ORD-001",
      location: "Amazon Rainforest, Brazil",
      trees: 1000,
      status: "completed",
      date: "2024-01-15",
      co2Reduction: 22000,
      cost: 5000
    },
    {
      id: "ORD-002", 
      location: "Congo Basin, Africa",
      trees: 500,
      status: "in_progress",
      date: "2024-01-20",
      co2Reduction: 11000,
      cost: 2500
    },
    {
      id: "ORD-003",
      location: "Borneo, Indonesia", 
      trees: 2000,
      status: "pending",
      date: "2024-01-25",
      co2Reduction: 44000,
      cost: 10000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in_progress": return <Clock className="w-4 h-4" />;
      case "pending": return <Calendar className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "orders", label: "Orders", icon: FileText },
    { id: "reports", label: "Sustainability Reports", icon: BarChart3 },
    { id: "certificates", label: "NFT Certificates", icon: Award },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-forest-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-emerald-200 h-fit sticky top-24">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-emerald-500 to-forest-600 text-white shadow-lg"
                      : "text-forest-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center">
                        <TreePine className="w-6 h-6 text-emerald-600" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-3xl font-bold text-forest-900 mb-2">
                      {userStats?.[0]?.toString() || "0"}
                    </div>
                    <div className="text-emerald-600 font-semibold">Trees Planted</div>
                    <div className="text-forest-600 text-sm mt-1">This year</div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <Globe className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-forest-900 mb-2">
                      {((Number(userStats?.[0]) || 0) * 22).toLocaleString()}
                    </div>
                    <div className="text-emerald-600 font-semibold">CO₂ Reduced (kg)</div>
                    <div className="text-forest-600 text-sm mt-1">Annual impact</div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-3xl font-bold text-forest-900 mb-2">3</div>
                    <div className="text-emerald-600 font-semibold">Active Projects</div>
                    <div className="text-forest-600 text-sm mt-1">Currently running</div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-forest-900">Recent Orders</h3>
                    <button
                      onClick={() => setShowCreateOrder(true)}
                      className="bg-gradient-to-r from-emerald-500 to-forest-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Create New Order</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-forest-600 rounded-xl flex items-center justify-center">
                              <TreePine className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-forest-900">{order.id}</div>
                              <div className="text-forest-600 text-sm">{order.location}</div>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status.replace('_', ' ')}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-forest-600">Trees</div>
                            <div className="font-semibold text-forest-900">{order.trees.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-forest-600">CO₂ Reduction</div>
                            <div className="font-semibold text-forest-900">{order.co2Reduction.toLocaleString()} kg</div>
                          </div>
                          <div>
                            <div className="text-forest-600">Cost</div>
                            <div className="font-semibold text-forest-900">${order.cost.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-forest-600">Date</div>
                            <div className="font-semibold text-forest-900">{order.date}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-forest-900">All Orders</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-forest-400" />
                        <input
                          type="text"
                          placeholder="Search orders..."
                          className="pl-10 pr-4 py-2 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-colors">
                        <Filter className="w-5 h-5" />
                        <span>Filter</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 border border-emerald-200 rounded-2xl hover:bg-emerald-50 transition-colors">
                        <Download className="w-5 h-5" />
                        <span>Export</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-emerald-200">
                          <th className="text-left py-4 px-4 font-semibold text-forest-900">Order ID</th>
                          <th className="text-left py-4 px-4 font-semibold text-forest-900">Location</th>
                          <th className="text-left py-4 px-4 font-semibold text-forest-900">Trees</th>
                          <th className="text-left py-4 px-4 font-semibold text-forest-900">Status</th>
                          <th className="text-left py-4 px-4 font-semibold text-forest-900">Date</th>
                          <th className="text-left py-4 px-4 font-semibold text-forest-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                            <td className="py-4 px-4">
                              <div className="font-semibold text-forest-900">{order.id}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-emerald-600" />
                                <span className="text-forest-700">{order.location}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-forest-900">{order.trees.toLocaleString()}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                <span className="capitalize">{order.status.replace('_', ' ')}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="text-forest-700">{order.date}</div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button className="p-2 hover:bg-emerald-100 rounded-xl transition-colors">
                                  <Eye className="w-4 h-4 text-emerald-600" />
                                </button>
                                <button className="p-2 hover:bg-emerald-100 rounded-xl transition-colors">
                                  <Edit className="w-4 h-4 text-emerald-600" />
                                </button>
                                <button className="p-2 hover:bg-red-100 rounded-xl transition-colors">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
                  <h3 className="text-2xl font-bold text-forest-900 mb-6">Sustainability Reports</h3>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <p className="text-forest-600">Sustainability reports will be available here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "certificates" && (
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
                  <h3 className="text-2xl font-bold text-forest-900 mb-6">NFT Certificates</h3>
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <p className="text-forest-600">NFT certificates will be displayed here</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200">
                  <h3 className="text-2xl font-bold text-forest-900 mb-6">Settings</h3>
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <p className="text-forest-600">Settings panel will be available here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-forest-900">Create New Carbon Compensation Order</h3>
              <button
                onClick={() => setShowCreateOrder(false)}
                className="text-forest-400 hover:text-forest-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-forest-700 font-semibold mb-2">Project Location</label>
                <input
                  type="text"
                  placeholder="e.g., Amazon Rainforest, Brazil"
                  className="w-full px-4 py-3 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-forest-700 font-semibold mb-2">Number of Trees</label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full px-4 py-3 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-forest-700 font-semibold mb-2">Budget (USD)</label>
                <input
                  type="number"
                  placeholder="5000"
                  className="w-full px-4 py-3 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-forest-700 font-semibold mb-2">Project Description</label>
                <textarea
                  placeholder="Describe your carbon compensation project..."
                  rows={4}
                  className="w-full px-4 py-3 border border-emerald-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowCreateOrder(false)}
                className="px-6 py-3 border border-emerald-200 rounded-2xl text-forest-700 hover:bg-emerald-50 transition-colors"
              >
                Cancel
              </button>
              <button className="bg-gradient-to-r from-emerald-500 to-forest-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;
