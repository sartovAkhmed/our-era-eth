"use client";

import Link from "next/link";
import { Bug, DollarSign, Globe2, Heart, Leaf, ShieldCheck, Sprout, Trees } from "lucide-react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, CurrencyDollarIcon, HeartIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import AvailableTrees from "~~/components/AvailableTrees";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { data: platformStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getPlatformStats",
  });

  return (
    <>
      <div className="flex flex-col grow min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-8 pb-12 px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="flex gap-4">
            <div className="text-start">
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
                Добро пожаловать в <span className="text-emerald-600">TreeChain</span>
              </h1>
              <p className="text-lg text-emerald-800 max-w-2xl mx-auto mb-8">
                Платформа, где каждый может финансировать посадку деревьев и получать NFT-подтверждение. Прозрачность
                всех операций обеспечена блокчейном.
              </p>
            </div>

            {connectedAddress && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 mb-8 inline-block">
                <p className="text-emerald-700 font-medium mb-2">Подключённый кошелёк:</p>
                <Address address={connectedAddress} />
              </div>
            )}
          </div>

          {/* Статистика */}
          {platformStats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
              {/* Trees Planted */}
              <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-50/60 to-white/70 backdrop-blur-sm border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 mb-3 text-3xl">
                  🌳
                </div>
                <p className="text-3xl font-extrabold text-emerald-700 leading-tight">
                  {platformStats?.[0]?.toString() || "0"}
                </p>
                <p className="text-sm text-emerald-600 mt-1 font-medium tracking-wide">Деревьев посажено</p>
              </div>

              {/* Donated Amount */}
              <div className="rounded-3xl p-6 bg-gradient-to-br from-blue-50/60 to-white/70 backdrop-blur-sm border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-100 mb-3">
                  <CurrencyDollarIcon className="h-7 w-7 text-blue-600" />
                </div>
                <p className="text-3xl font-extrabold text-blue-700 leading-tight">
                  {(Number(platformStats?.[1]) / 1e18).toFixed(2)} ETH
                </p>
                <p className="text-sm text-blue-600 mt-1 font-medium tracking-wide">Пожертвовано</p>
              </div>

              {/* Rewards Paid */}
              <div className="rounded-3xl p-6 bg-gradient-to-br from-purple-50/60 to-white/70 backdrop-blur-sm border border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-100 mb-3">
                  <ShieldCheckIcon className="h-7 w-7 text-purple-600" />
                </div>
                <p className="text-3xl font-extrabold text-purple-700 leading-tight">
                  {(Number(platformStats?.[2]) / 1e18).toFixed(2)} ETH
                </p>
                <p className="text-sm text-purple-600 mt-1 font-medium tracking-wide">Наград выплачено</p>
              </div>
            </div>
          )}
        </div>

        {/* Cards Section */}
        <div className="grow w-full px-4 mt-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Донор */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-rose-50 to-red-50 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-rose-200 hover:border-rose-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-rose-200 rounded-full -mr-20 -mt-20 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-200 rounded-full -ml-16 -mb-16 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Heart className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-3xl font-bold text-rose-900 mb-4">Для Доноров</h3>
                  <p className="text-rose-800 text-lg mb-8 leading-relaxed">
                    Покупайте NFT-сертификаты деревьев и поддерживайте экологические проекты
                  </p>

                  <Link
                    href="/donor"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-red-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-rose-600 hover:to-red-600 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Heart className="w-5 h-5" />
                    Стать донором
                  </Link>
                </div>
              </div>

              {/* Исполнитель */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-green-200 hover:border-green-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-200 rounded-full -mr-20 -mt-20 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-200 rounded-full -ml-16 -mb-16 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Sprout className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-3xl font-bold text-green-900 mb-4">Для Исполнителей</h3>
                  <p className="text-green-800 text-lg mb-8 leading-relaxed">
                    Сажайте деревья, получайте награды в токенах и помогайте планете
                  </p>

                  <Link
                    href="/executor"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Sprout className="w-5 h-5" />
                    Стать исполнителем
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AvailableTrees />

              {/* Отладка */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-amber-200 hover:border-amber-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-200 rounded-full -mr-20 -mt-20 opacity-20 group-hover:scale-150 transition-transform duration-700"></div>

                <div className="relative">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                    <Bug className="w-10 h-10 text-white" />
                  </div>

                  <h3 className="text-3xl font-bold text-amber-900 mb-4">Отладка</h3>
                  <p className="text-amber-800 text-lg mb-8 leading-relaxed">
                    Взаимодействуйте со смарт-контрактами через интерфейс отладки
                  </p>

                  <Link
                    href="/debug"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Bug className="w-5 h-5" />
                    Открыть отладку
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
