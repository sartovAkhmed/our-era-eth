"use client";

import { useState } from "react";
import { 
  X, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Clock, 
  QrCode, 
  Share2, 
  Download,
  TreePine,
  Globe,
  Shield,
  TrendingUp,
  Camera,
  FileText,
  ArrowRight,
  Copy,
  ExternalLink
} from "lucide-react";

interface TreeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tree: {
    id: string;
    location: string;
    species: string;
    plantedDate: string;
    status: string;
    co2Impact: number;
    coordinates: { lat: number; lng: number };
    qrCode: string;
    image?: string;
    executor?: string;
    donor?: string;
  };
}

const TreeDetailsModal = ({ isOpen, onClose, tree }: TreeDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [qrCodeVisible, setQrCodeVisible] = useState(false);

  if (!isOpen) return null;

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
      case "planted": return <Clock className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const progressSteps = [
    { id: "ordered", label: "Ordered", status: "completed", date: "2024-01-10" },
    { id: "planted", label: "Planted", status: tree.status === "verified" || tree.status === "planted" ? "completed" : "pending", date: tree.plantedDate },
    { id: "verified", label: "Verified", status: tree.status === "verified" ? "completed" : "pending", date: tree.status === "verified" ? "2024-01-30" : null },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-forest-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <TreePine className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{tree.id}</h2>
                <p className="text-emerald-100">{tree.species}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Left Panel - Tree Image & Map */}
          <div className="w-1/2 p-6 space-y-6">
            {/* Tree Image */}
            <div className="bg-gradient-to-br from-emerald-100 to-forest-100 rounded-2xl h-48 flex items-center justify-center">
              {tree.image ? (
                <img src={tree.image} alt={tree.species} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <TreePine className="w-16 h-16 text-emerald-600" />
              )}
            </div>

            {/* Mini Map */}
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl h-32 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23059669" fill-opacity="0.1"%3E%3Ccircle cx="50" cy="50" r="3"/%3E%3C/g%3E%3C/svg%3E')]"></div>
              <div className="text-center z-10">
                <MapPin className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-forest-700 font-semibold text-sm">{tree.location}</p>
                <p className="text-emerald-600 text-xs">{tree.coordinates.lat}, {tree.coordinates.lng}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setQrCodeVisible(!qrCodeVisible)}
                className="flex items-center justify-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-2xl hover:bg-emerald-100 transition-colors"
              >
                <QrCode className="w-5 h-5" />
                <span className="font-medium">QR Code</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-2xl hover:bg-blue-100 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>

          {/* Right Panel - Details */}
          <div className="w-1/2 border-l border-emerald-200">
            {/* Tabs */}
            <div className="flex border-b border-emerald-200">
              {[
                { id: "overview", label: "Overview" },
                { id: "timeline", label: "Timeline" },
                { id: "impact", label: "Impact" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-forest-600 hover:text-forest-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 h-full overflow-y-auto">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="bg-emerald-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-forest-600 font-medium">Status</span>
                      <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(tree.status)}`}>
                        {getStatusIcon(tree.status)}
                        <span className="capitalize">{tree.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Location Details */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="font-semibold text-forest-900">{tree.location}</div>
                        <div className="text-forest-600 text-sm">Coordinates: {tree.coordinates.lat}, {tree.coordinates.lng}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="font-semibold text-forest-900">Planted Date</div>
                        <div className="text-forest-600 text-sm">{tree.plantedDate}</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <TreePine className="w-5 h-5 text-emerald-600" />
                      <div>
                        <div className="font-semibold text-forest-900">Species</div>
                        <div className="text-forest-600 text-sm">{tree.species}</div>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Info */}
                  <div className="bg-forest-50 rounded-2xl p-4">
                    <h4 className="font-semibold text-forest-900 mb-3">Blockchain Verification</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-forest-600">Transaction Hash:</span>
                        <button
                          onClick={() => copyToClipboard("0x1234...5678")}
                          className="flex items-center space-x-1 text-emerald-600 hover:text-emerald-700"
                        >
                          <span>0x1234...5678</span>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Block Number:</span>
                        <span className="text-forest-900">18,234,567</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Verification:</span>
                        <div className="flex items-center space-x-1 text-emerald-600">
                          <Shield className="w-3 h-3" />
                          <span>Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "timeline" && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-forest-900 mb-4">Progress Timeline</h4>
                  
                  <div className="space-y-4">
                    {progressSteps.map((step, index) => (
                      <div key={step.id} className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === "completed" 
                            ? "bg-emerald-100 text-emerald-600" 
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {step.status === "completed" ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-forest-900">{step.label}</div>
                          {step.date && (
                            <div className="text-forest-600 text-sm">{step.date}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Proof Documents */}
                  <div className="bg-emerald-50 rounded-2xl p-4">
                    <h4 className="font-semibold text-forest-900 mb-3">Proof Documents</h4>
                    <div className="space-y-2">
                      <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl hover:bg-emerald-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Camera className="w-4 h-4 text-emerald-600" />
                          <span className="text-forest-700">Planting Photo</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-forest-400" />
                      </button>
                      <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl hover:bg-emerald-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="text-forest-700">GPS Coordinates</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-forest-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "impact" && (
                <div className="space-y-6">
                  <h4 className="font-semibold text-forest-900 mb-4">Environmental Impact</h4>
                  
                  {/* CO₂ Impact */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                        <span className="font-semibold text-forest-900">CO₂ Reduction</span>
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{tree.co2Impact} kg/year</div>
                    <p className="text-forest-600 text-sm">Annual CO₂ absorption capacity</p>
                  </div>

                  {/* Environmental Benefits */}
                  <div className="space-y-4">
                    <h5 className="font-semibold text-forest-900">Environmental Benefits</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-emerald-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-emerald-600">22</div>
                        <div className="text-forest-600 text-sm">kg CO₂/year</div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">260</div>
                        <div className="text-forest-600 text-sm">kg O₂/year</div>
                      </div>
                    </div>
                  </div>

                  {/* Long-term Impact */}
                  <div className="bg-forest-50 rounded-2xl p-4">
                    <h5 className="font-semibold text-forest-900 mb-3">Long-term Impact (30 years)</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-forest-600">Total CO₂ absorbed:</span>
                        <span className="font-semibold text-forest-900">660 kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Equivalent to:</span>
                        <span className="font-semibold text-forest-900">3,000 km driven</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Code Modal */}
        {qrCodeVisible && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4">
              <div className="text-center">
                <h3 className="text-xl font-bold text-forest-900 mb-4">Tree QR Code</h3>
                <div className="bg-white border-2 border-emerald-200 rounded-2xl p-6 mb-4">
                  <div className="w-32 h-32 bg-gradient-to-br from-emerald-100 to-forest-100 rounded-xl flex items-center justify-center mx-auto">
                    <QrCode className="w-16 h-16 text-emerald-600" />
                  </div>
                </div>
                <p className="text-forest-600 text-sm mb-4">
                  Scan to view tree details and verification
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setQrCodeVisible(false)}
                    className="flex-1 px-4 py-2 border border-emerald-200 rounded-xl text-forest-700 hover:bg-emerald-50 transition-colors"
                  >
                    Close
                  </button>
                  <button className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeDetailsModal;
