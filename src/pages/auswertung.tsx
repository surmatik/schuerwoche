// pages/auswertung.tsx
"use client";

import { useEffect, useState } from "react";
import { Client, Databases } from "appwrite";
import Link from "next/link";
import Image from "next/image";
import CeviLogo from "../../public/cevi-logo.png";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6851b3080024374d0ade");

const databases = new Databases(client);
const databaseId = "6851b31000348b1557df";
const collectionId = "6851b3c1002759f58afe";

const days = [
  ["6. Juli", "Sonntag"],
  ["7. Juli", "Montag"],
  ["8. Juli", "Dienstag"],
  ["9. Juli", "Mittwoch"],
  ["10. Juli", "Donnerstag"],
  ["11. Juli", "Freitag"],
  ["12. Juli", "Samstag"],
];

export default function Auswertung() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [essenPerDay, setEssenPerDay] = useState<{ [key: string]: { Fleisch: number; Vegi: number; Abend: number; Schlafen: number } }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await databases.listDocuments(databaseId, collectionId);
        setData(res.documents);

        const perDay: { [key: string]: { Fleisch: number; Vegi: number; Abend: number; Schlafen: number } } = {};
        days.forEach(([day]) => (perDay[day] = { Fleisch: 0, Vegi: 0, Abend: 0, Schlafen: 0 }));

        res.documents.forEach((entry: any) => {
          const antworten = JSON.parse(entry.antworten || "{}");
          days.forEach(([day]) => {
            if (antworten?.[day]?.["Abendprogramm"]) perDay[day].Abend++;
            if (antworten?.[day]?.["Schlafen"]) perDay[day].Schlafen++;
            if (antworten?.[day]?.["Abendprogramm"] || antworten?.[day]?.["Schlafen"]) {
              const typ = entry.essen === "Vegi" ? "Vegi" : "Fleisch";
              perDay[day][typ]++;
            }
          });
        });

        setEssenPerDay(perDay);
      } catch (err) {
        console.error("Fehler beim Laden der Daten:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6fa] to-[#eceff5] font-sans">
      <div className="flex justify-center pt-10">
        <header className="w-full max-w-6xl bg-white shadow-md rounded-3xl">
          <div className="px-6 pt-6 pb-3 flex items-center gap-4">
            <Image src={CeviLogo} alt="Cevi Logo" width={40} height={40} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Schüürwuche 2025</h1>
              <span className="text-sm text-gray-500">Cevi Wetzikon</span>
            </div>
          </div>
          <div className="bg-[#f5f5f5] text-sm text-gray-700 py-2 px-6 text-center shadow-inner rounded-b-3xl">
            🔙 <Link href="/" className="text-[#b10030] font-semibold underline hover:text-[#8e0026]">Zurück zum Formular</Link>
          </div>
        </header>
      </div>

      <main className="flex flex-col items-center px-4 py-10 gap-10">
        {loading ? (
          <p className="text-center text-gray-600">Lade Daten...</p>
        ) : (
          <>
            <div className="w-full max-w-6xl overflow-x-auto rounded-3xl shadow-xl bg-white">
              <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-[#f0f0f5]">
                  <tr>
                    <th className="p-4 text-left font-semibold sticky left-0 bg-[#f0f0f5] z-10">Name</th>
                    {days.map(([day, wtag]) => (
                      <th key={day} className="p-4 font-semibold whitespace-nowrap text-center">
                        <div>{day} <span className="text-gray-400 font-normal text-xs">({wtag})</span></div>
                        <div className="text-xs text-gray-500 mt-1">
                          🪁 {essenPerDay[day]?.Abend || 0} · 🛏️ {essenPerDay[day]?.Schlafen || 0}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((entry, i) => {
                    const antworten = JSON.parse(entry.antworten || "{}");
                    return (
                      <tr key={entry.$id} className={i % 2 === 0 ? "bg-white" : "bg-[#fafafa] hover:bg-[#f5f5f5]"}>
                        <td className="p-4 font-medium sticky left-0 bg-white z-0 whitespace-nowrap">{entry.name}</td>
                        {days.map(([day]) => {
                          const tags = [];
                          if (antworten?.[day]?.["Abendprogramm"]) tags.push("🪁 Abend");
                          if (antworten?.[day]?.["Schlafen"]) tags.push("🛏️ Schlafen");
                          return (
                            <td key={day} className="p-2 text-center text-sm">
                              {tags.length > 0 ? tags.join(" · ") : "—"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="w-full max-w-6xl mt-4 px-6 py-6 bg-white border rounded-3xl shadow-xl">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">🍽️ Essensübersicht</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {days.map(([day, wtag]) => (
                  <div
                    key={day}
                    className="bg-[#f9f9fb] border rounded-xl px-4 py-3 shadow-sm text-sm text-center"
                  >
                    <p className="font-semibold text-gray-700 mb-1">
                      {day} <span className="text-gray-400">({wtag})</span>
                    </p>
                    <p className="text-gray-700">🥩 Fleisch: <span className="font-bold text-gray-900">{essenPerDay[day]?.Fleisch || 0}</span></p>
                    <p className="text-gray-700">🥗 Vegi: <span className="font-bold text-gray-900">{essenPerDay[day]?.Vegi || 0}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}