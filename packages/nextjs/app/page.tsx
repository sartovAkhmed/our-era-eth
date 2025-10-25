"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  CheckCircle, 
  Globe, 
  Heart, 
  Leaf, 
  MapPin, 
  Shield, 
  Sprout, 
  TreePine, 
  Users,
  Zap,
  ArrowRight,
  Star,
  Award,
  TrendingUp,
  Map,
  FileText
} from "lucide-react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  // Read platform statistics
  const { data: platformStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getPlatformStats",
  });

  // Read user statistics
  const { data: userStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getUserStats",
    args: connectedAddress ? [connectedAddress] : ["0x0000000000000000000000000000000000000000"],
  });

  // Hook for purchasing trees
  const { writeContractAsync: purchaseTreeAsync } = useScaffoldWriteContract({
    contractName: "TreeChain",
  });

  // Function for quick tree purchase
  const handleQuickPurchase = async () => {
    if (!connectedAddress) {
      alert("Please connect your wallet");
      return;
    }

    setIsLoading(true);
    try {
      await purchaseTreeAsync({
        functionName: "purchaseTree",
        args: ["Oak Tree", "Global Forest Project"],
      });
      alert("Tree successfully purchased! You received an NFT certificate.");
    } catch (error) {
      console.error("Error purchasing tree:", error);
      alert("Error purchasing tree. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-emerald-50 via-white to-forest-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-emerald-50/20 opacity-40"></div>
        
        <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-6xl mx-auto">
            {/* Hero Content */}
            <div className="text-center mb-20">
              <h1 className="text-6xl md:text-7xl font-bold text-forest-900 mb-6 leading-tight">
                Compensate CO₂ with{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-forest-600 bg-clip-text text-transparent">
                  real trees
                </span>
                <br />
                <span className="text-4xl md:text-5xl text-emerald-700">Verified on blockchain</span>
              </h1>
              
              <p className="text-xl text-forest-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                Join the transparent ecosystem where businesses offset their carbon footprint 
                and individuals support verified tree planting projects worldwide.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <Link
                  href="/business"
                  className="group bg-gradient-to-r from-emerald-600 to-forest-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3"
                >
                  <Building2 className="w-6 h-6" />
                  <span>For Businesses</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href="/donor"
                  className="group bg-white text-forest-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-emerald-200 hover:border-emerald-300 flex items-center space-x-3"
                >
                  <Heart className="w-6 h-6" />
                  <span>For Donors</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Quick Purchase Button */}
                {connectedAddress && (
                  <button
                    onClick={handleQuickPurchase}
                    disabled={isLoading}
                    className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <TreePine className="w-6 h-6" />
                    )}
                    <span>{isLoading ? "Processing..." : "Buy Tree Now"}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              {/* User Stats (if connected) */}
              {connectedAddress && userStats && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-emerald-200 max-w-4xl mx-auto mb-8">
                  <h3 className="text-2xl font-bold text-forest-900 mb-6 text-center">Your Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <TreePine className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div className="text-3xl font-bold text-forest-900 mb-2">
                        {userStats?.[0]?.toString() || "0"}
                      </div>
                      <div className="text-emerald-600 font-semibold">Trees Donated</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sprout className="w-8 h-8 text-blue-600" />
                      </div>
                      <div className="text-3xl font-bold text-forest-900 mb-2">
                        {userStats?.[1]?.toString() || "0"}
                      </div>
                      <div className="text-emerald-600 font-semibold">Trees Planted</div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-forest-900 mb-2">
                        {((Number(userStats?.[0]) || 0) * 22).toLocaleString()}
                      </div>
                      <div className="text-emerald-600 font-semibold">CO₂ Reduced (kg)</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Map Preview */}
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-emerald-200 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-forest-900">Global Impact Map</h3>
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <MapPin className="w-5 h-5" />
                    <span className="font-semibold">Live Updates</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-emerald-100 to-forest-100 rounded-2xl h-64 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-100/30"></div>
                  <div className="text-center z-10">
                    <Globe className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <p className="text-forest-700 font-semibold">Interactive map showing planted trees worldwide</p>
                    <p className="text-emerald-600 text-sm mt-2">Real-time blockchain verification</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-forest-900 mb-6">How TreeChain Works</h2>
              <p className="text-xl text-forest-700 max-w-3xl mx-auto">
                A simple three-step process that connects businesses, donors, and planters 
                through transparent blockchain technology
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1: Fund */}
              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-forest-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">1</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-forest-900 mb-4">Fund</h3>
                <p className="text-forest-700 leading-relaxed">
                  Businesses and individuals fund tree planting projects with transparent 
                  blockchain transactions and real-time tracking.
                </p>
              </div>

              {/* Step 2: Plant */}
              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Sprout className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">2</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-forest-900 mb-4">Plant</h3>
                <p className="text-forest-700 leading-relaxed">
                  Verified planters receive tasks and plant trees with GPS verification, 
                  photo proof, and blockchain documentation.
                </p>
              </div>

              {/* Step 3: Verify */}
              <div className="group text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-forest-900 mb-4">Verify</h3>
                <p className="text-forest-700 leading-relaxed">
                  Independent verifiers confirm tree planting with blockchain certificates 
                  and NFT ownership for complete transparency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-forest-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-forest-900 mb-6">Our Global Impact</h2>
              <p className="text-xl text-forest-700">
                Real numbers from our blockchain-verified platform
              </p>
            </div>

            {platformStats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {/* Trees Planted */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200 text-center group hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TreePine className="w-10 h-10 text-emerald-600" />
                  </div>
                  <div className="text-4xl font-bold text-forest-900 mb-2">
                    {platformStats?.[0]?.toString() || "0"}
                  </div>
                  <div className="text-emerald-600 font-semibold">Trees Planted</div>
                  <div className="text-forest-600 text-sm mt-2">Blockchain verified</div>
                  <div className="mt-4 text-xs text-emerald-500 font-medium">
                    Click to view on blockchain
                  </div>
                </div>

                {/* CO₂ Reduced */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200 text-center group hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="text-4xl font-bold text-forest-900 mb-2">
                    {((Number(platformStats?.[0]) || 0) * 22).toLocaleString()}
                  </div>
                  <div className="text-emerald-600 font-semibold">CO₂ Reduced (kg)</div>
                  <div className="text-forest-600 text-sm mt-2">Annual average per tree</div>
                  <div className="mt-4 text-xs text-blue-500 font-medium">
                    Environmental impact
                  </div>
                </div>

                {/* Countries */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-emerald-200 text-center group hover:shadow-2xl transition-all duration-300 cursor-pointer">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-10 h-10 text-purple-600" />
                  </div>
                  <div className="text-4xl font-bold text-forest-900 mb-2">47</div>
                  <div className="text-emerald-600 font-semibold">Countries</div>
                  <div className="text-forest-600 text-sm mt-2">Active projects</div>
                  <div className="mt-4 text-xs text-purple-500 font-medium">
                    Global reach
                  </div>
                </div>
              </div>
            )}

            {/* Partner Logos */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-forest-900 mb-8">Trusted by Leading Organizations</h3>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="bg-forest-100 rounded-2xl px-6 py-3 text-forest-700 font-semibold">Microsoft</div>
                <div className="bg-forest-100 rounded-2xl px-6 py-3 text-forest-700 font-semibold">Google</div>
                <div className="bg-forest-100 rounded-2xl px-6 py-3 text-forest-700 font-semibold">Tesla</div>
                <div className="bg-forest-100 rounded-2xl px-6 py-3 text-forest-700 font-semibold">Amazon</div>
                <div className="bg-forest-100 rounded-2xl px-6 py-3 text-forest-700 font-semibold">Apple</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-forest-600 rounded-xl flex items-center justify-center">
                    <TreePine className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold">TreeChain</span>
                </div>
                <p className="text-forest-200 leading-relaxed">
                  Transparent tree planting platform powered by blockchain technology.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-forest-200">
                  <li><Link href="/business" className="hover:text-emerald-400 transition-colors flex items-center space-x-2"><Building2 className="w-4 h-4" /><span>For Businesses</span></Link></li>
                  <li><Link href="/donor" className="hover:text-emerald-400 transition-colors flex items-center space-x-2"><Heart className="w-4 h-4" /><span>For Donors</span></Link></li>
                  <li><Link href="/executor" className="hover:text-emerald-400 transition-colors flex items-center space-x-2"><Sprout className="w-4 h-4" /><span>For Planters</span></Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-forest-200">
                  <li><Link href="/debug" className="hover:text-emerald-400 transition-colors flex items-center space-x-2"><Shield className="w-4 h-4" /><span>Debug Console</span></Link></li>
                  <li><Link href="/docs" className="hover:text-emerald-400 transition-colors flex items-center space-x-2"><FileText className="w-4 h-4" /><span>Documentation</span></Link></li>
                  <li><Link href="/api" className="hover:text-emerald-400 transition-colors flex items-center space-x-2"><Globe className="w-4 h-4" /><span>API</span></Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Connect</h4>
                <ul className="space-y-2 text-forest-200">
                  <li><Link href="/contact" className="hover:text-emerald-400 transition-colors flex items-center space-x-2"><MapPin className="w-4 h-4" /><span>Contact</span></Link></li>
                  <li><Link href="/support" className="hover:text-emerald-400 transition-colors flex items-center space-x-2"><Heart className="w-4 h-4" /><span>Support</span></Link></li>
                  <li><Link href="/community" className="hover:text-emerald-400 transition-colors flex items-center space-x-2"><Users className="w-4 h-4" /><span>Community</span></Link></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-forest-700 pt-8 text-center text-forest-300">
              <p>&copy; 2024 TreeChain. All rights reserved. Built with transparency and trust.</p>
            </div>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Home;
