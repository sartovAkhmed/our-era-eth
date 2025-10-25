"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, CurrencyDollarIcon, HeartIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import AvailableTrees from "~~/components/AvailableTrees";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  // Читаем статистику платформы
  const { data: platformStats } = useScaffoldReadContract({
    contractName: "TreeChain",
    functionName: "getPlatformStats",
  });

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Добро пожаловать в</span>
            <span className="block text-4xl font-bold text-green-600">🌳 TreeChain</span>
          </h1>
          <p className="text-center text-lg text-gray-600 mb-8">
            Платформа для финансирования посадки деревьев с NFT сертификатами и блокчейн прозрачностью
          </p>

          {connectedAddress && (
            <div className="flex justify-center items-center space-x-2 flex-col mb-8">
              <p className="my-2 font-medium">Подключенный адрес:</p>
              <Address address={connectedAddress} />
            </div>
          )}

          {/* Статистика платформы */}
          {platformStats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-green-100 p-4 rounded-lg text-center">
                <div className="text-4xl mb-2">🌳</div>
                <p className="text-2xl font-bold text-green-600">{platformStats[0]?.toString() || "0"}</p>
                <p className="text-sm text-gray-600">Деревьев посажено</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <CurrencyDollarIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold text-blue-600">{(Number(platformStats[1]) / 1e18).toFixed(2)} ETH</p>
                <p className="text-sm text-gray-600">Пожертвовано</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-lg text-center">
                <ShieldCheckIcon className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold text-purple-600">{(Number(platformStats[2]) / 1e18).toFixed(2)} ETH</p>
                <p className="text-sm text-gray-600">Наград выплачено</p>
              </div>
            </div>
          )}
        </div>

        <div className="grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center rounded-3xl hover:shadow-lg transition-shadow">
                <HeartIcon className="h-8 w-8 fill-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Для Доноров</h3>
                <p className="mb-4">Покупайте NFT сертификаты деревьев и поддерживайте экологические проекты</p>
                <Link href="/donor" className="btn btn-primary">
                  Стать донором
                </Link>
              </div>

              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center rounded-3xl hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-xl font-bold mb-2">Для Исполнителей</h3>
                <p className="mb-4">Сажайте деревья, получайте награды в токенах и помогайте планете</p>
                <Link href="/executor" className="btn btn-success">
                  Стать исполнителем
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AvailableTrees />

              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center rounded-3xl hover:shadow-lg transition-shadow">
                <BugAntIcon className="h-8 w-8 fill-secondary mb-4" />
                <h3 className="text-xl font-bold mb-2">Отладка</h3>
                <p className="mb-4">
                  Взаимодействуйте со смарт-контрактами через{" "}
                  <Link href="/debug" className="link">
                    Debug Contracts
                  </Link>
                </p>
                <Link href="/debug" className="btn btn-secondary">
                  Открыть отладку
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
