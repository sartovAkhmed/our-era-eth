"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  Heart, 
  Sprout, 
  Shield,
  Menu,
  X,
  LogOut,
  TreePine
} from "lucide-react";
import { useAccount, useDisconnect } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth/RainbowKitCustomConnectButton";

export const TreeChainHeader = () => {
  const { address: connectedAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-sm border-b border-emerald-200 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-forest-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <TreePine className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-forest-900 group-hover:text-emerald-600 transition-colors">
                TreeChain
              </span>
              <span className="text-xs text-forest-600">Ecological Blockchain</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-forest-700 hover:text-emerald-600 font-medium transition-colors flex items-center space-x-2">
              <span>Home</span>
            </Link>
            <Link href="/donor" className="text-forest-700 hover:text-emerald-600 font-medium transition-colors flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Donors</span>
            </Link>
            <Link href="/executor" className="text-forest-700 hover:text-emerald-600 font-medium transition-colors flex items-center space-x-2">
              <Sprout className="w-4 h-4" />
              <span>Executors</span>
            </Link>
            <Link href="/business" className="text-forest-700 hover:text-emerald-600 font-medium transition-colors flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span>Business</span>
            </Link>
            <Link href="/debug" className="text-forest-700 hover:text-emerald-600 font-medium transition-colors flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Debug</span>
            </Link>
          </nav>
          
          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {connectedAddress ? (
              <div className="flex items-center space-x-3">
                <div className="bg-emerald-50 rounded-2xl px-4 py-2 border border-emerald-200">
                  <Address address={connectedAddress} />
                </div>
                <button
                  onClick={() => disconnect()}
                  className="p-2 text-forest-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  title="Disconnect Wallet"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <RainbowKitCustomConnectButton />
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-forest-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-emerald-200">
            <nav className="p-6 space-y-4">
              <Link 
                href="/" 
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="font-medium text-forest-900">Home</span>
              </Link>
              <Link 
                href="/donor" 
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-forest-900">Donors</span>
              </Link>
              <Link 
                href="/executor" 
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Sprout className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-forest-900">Executors</span>
              </Link>
              <Link 
                href="/business" 
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-forest-900">Business</span>
              </Link>
              <Link 
                href="/debug" 
                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-emerald-50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="font-medium text-forest-900">Debug</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
