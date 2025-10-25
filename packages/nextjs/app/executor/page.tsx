"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sprout, 
  TreePine, 
  MapPin, 
  Camera, 
  CheckCircle, 
  Clock, 
  Navigation,
  Upload,
  FileText,
  Award,
  Wallet,
  TrendingUp,
  Globe,
  Shield,
  ArrowRight,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  QrCode,
  Share2
} from "lucide-react";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

const ExecutorMobile = () => {
  const { address: connectedAddress } = useAccount();
  const [activeTab, setActiveTab] = useState("tasks");
  const [showUploadProof, setShowUploadProof] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const { data: userStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getUserStats",
    args: connectedAddress ? [connectedAddress] : undefined,
  });

  // Mock data for planting tasks
  const plantingTasks = [
    {
      id: "TASK-001",
      location: "Amazon Rainforest, Brazil",
      species: "Brazilian Rosewood",
      coordinates: { lat: -3.4653, lng: -62.2159 },
      status: "assigned",
      priority: "high",
      deadline: "2024-02-15",
      reward: 50,
      description: "Plant 10 Brazilian Rosewood trees in designated area"
    },
    {
      id: "TASK-002",
      location: "Congo Basin, Africa",
      species: "African Mahogany",
      coordinates: { lat: 0.2280, lng: 20.8783 },
      status: "in_progress",
      priority: "medium",
      deadline: "2024-02-20",
      reward: 45,
      description: "Plant 5 African Mahogany trees with GPS verification"
    },
    {
      id: "TASK-003",
      location: "Borneo, Indonesia",
      species: "Dipterocarp",
      coordinates: { lat: 0.7893, lng: 113.9213 },
      status: "completed",
      priority: "low",
      deadline: "2024-02-10",
      reward: 40,
      description: "Plant 8 Dipterocarp trees and upload proof"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-emerald-100 text-emerald-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "assigned": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4" />;
      case "in_progress": return <Clock className="w-4 h-4" />;
      case "assigned": return <Sprout className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-forest-50">

      <div className="px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                <TreePine className="w-4 h-4 text-emerald-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-forest-900">{userStats?.[1]?.toString() || "0"}</div>
            <div className="text-emerald-600 font-semibold text-sm">Trees Planted</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-forest-900">1,250</div>
            <div className="text-emerald-600 font-semibold text-sm">Reward Tokens</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white/80 backdrop-blur-sm rounded-2xl p-1 mb-6 border border-emerald-200">
          {[
            { id: "tasks", label: "Tasks", icon: Sprout },
            { id: "completed", label: "Completed", icon: CheckCircle },
            { id: "profile", label: "Profile", icon: Award }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-emerald-500 to-forest-600 text-white shadow-lg"
                  : "text-forest-600 hover:bg-emerald-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tasks List */}
        {activeTab === "tasks" && (
          <div className="space-y-4">
            {plantingTasks.filter(task => task.status !== "completed").map((task) => (
              <div key={task.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-forest-100 rounded-xl flex items-center justify-center">
                      <Sprout className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-forest-900">{task.id}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">{task.reward}</div>
                    <div className="text-xs text-forest-600">tokens</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-forest-700 text-sm">{task.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TreePine className="w-4 h-4 text-emerald-600" />
                    <span className="text-forest-700 text-sm">{task.species}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span className="text-forest-700 text-sm">Due: {task.deadline}</span>
                  </div>
                </div>

                <p className="text-forest-600 text-sm mb-4">{task.description}</p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setShowUploadProof(true);
                    }}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-forest-600 text-white py-2 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload Proof</span>
                  </button>
                  <button className="bg-emerald-50 text-emerald-600 py-2 px-4 rounded-xl hover:bg-emerald-100 transition-colors">
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Completed Tasks */}
        {activeTab === "completed" && (
          <div className="space-y-4">
            {plantingTasks.filter(task => task.status === "completed").map((task) => (
              <div key={task.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-forest-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-forest-900">{task.id}</h3>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">{task.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">+{task.reward}</div>
                    <div className="text-xs text-forest-600">tokens earned</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-forest-700 text-sm">{task.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TreePine className="w-4 h-4 text-emerald-600" />
                    <span className="text-forest-700 text-sm">{task.species}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-200 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-forest-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-forest-900 mb-2">Tree Planter</h3>
              <p className="text-forest-600 text-sm">Your environmental impact level</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-200 text-center">
                <div className="text-2xl font-bold text-forest-900">{userStats?.[1]?.toString() || "0"}</div>
                <div className="text-emerald-600 font-semibold text-sm">Trees Planted</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-emerald-200 text-center">
                <div className="text-2xl font-bold text-forest-900">1,250</div>
                <div className="text-emerald-600 font-semibold text-sm">Total Rewards</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Proof Modal */}
      {showUploadProof && selectedTask && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-forest-900">Upload Proof</h3>
              <button
                onClick={() => setShowUploadProof(false)}
                className="text-forest-400 hover:text-forest-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-xl p-4">
                <h4 className="font-semibold text-forest-900 mb-2">{selectedTask.id}</h4>
                <p className="text-forest-600 text-sm">{selectedTask.description}</p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-600 py-3 rounded-xl hover:bg-emerald-100 transition-colors">
                  <Camera className="w-5 h-5" />
                  <span>Take Photo</span>
                </button>
                
                <button className="w-full flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 py-3 rounded-xl hover:bg-blue-100 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>Upload Photo</span>
                </button>
                
                <button className="w-full flex items-center justify-center space-x-2 bg-green-50 text-green-600 py-3 rounded-xl hover:bg-green-100 transition-colors">
                  <Navigation className="w-5 h-5" />
                  <span>Record GPS</span>
                </button>
              </div>
              
              <div className="bg-forest-50 rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-forest-600" />
                  <span className="font-semibold text-forest-900 text-sm">Verification Required</span>
                </div>
                <p className="text-forest-600 text-xs">
                  Photo must show planted tree with GPS coordinates. 
                  Verification will be reviewed within 24 hours.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <button
                onClick={() => setShowUploadProof(false)}
                className="flex-1 px-4 py-2 border border-emerald-200 rounded-xl text-forest-700 hover:bg-emerald-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-gradient-to-r from-emerald-500 to-forest-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Submit Proof
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutorMobile;