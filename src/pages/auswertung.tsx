// pages/auswertung.tsx
"use client";

import { useEffect, useState } from "react";
import { Client, Databases } from "appwrite";
import Link from "next/link";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6851b3080024374d0ade");

const databases = new Databases(client);
const databaseId = "6851b31000348b1557df";
const collectionId = "6851b3c1002759f58afe";

const days = ["6. Juli", "7. Juli", "8. Juli", "9. Juli", "10. Juli", "11. Juli", "12. Juli"];
const options = ["Abendprogramm", "Schlafen"];

export default function Auswertung() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [essenStats, setEssenStats] = useState({ Fleisch: 0, Vegi: 0 });
  const [essenPerDay, setEssenPerDay] = useState<{ [key: string]: { Fleisch: number; Vegi: number } }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await databases.listDocuments(databaseId, collectionId);
        setData(res.documents);

        const count = { Fleisch: 0, Vegi: 0 };
        const perDay: { [key: string]: { Fleisch: number; Vegi: number } } = {};
        days.forEach((day) => (perDay[day] = { Fleisch: 0, Vegi: 0 }));

        res.documents.forEach((entry: any) => {
          if (entry.essen === "Fleisch") count.Fleisch++;
          if (entry.essen === "Vegi") count.Vegi++;

          const antworten = JSON.parse(entry.antworten || "{}");
          days.forEach((day) => {
            if (antworten?.[day]?.["Abendprogramm"] || antworten?.[day]?.["Schlafen"]) {
              const typ = entry.essen === "Vegi" ? "Vegi" : "Fleisch";
              perDay[day][typ]++;
            }
          });
        });

        setEssenStats(count);
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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8f8] to-[#eeeeee] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">📊 Schüürwuche 2025</h1>

        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-block bg-[#b10030] hover:bg-[#970029] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
          >
            Zurück zum Formular
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Lade Daten...</p>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl shadow mb-6">
              <table className="min-w-full border text-sm bg-white">
                <thead className="bg-[#f0f0f0] text-gray-700">
                  <tr>
                    <th className="border p-3 text-left font-bold">Name</th>
                    {days.map((day) => (
                      <th
                        key={day}
                        className="border p-3 text-center font-semibold whitespace-nowrap"
                      >
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((entry, i) => {
                    const antworten = JSON.parse(entry.antworten || "{}");
                    return (
                      <tr key={entry.$id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="border p-3 font-medium text-gray-800">{entry.name}</td>
                        {days.map((day) => {
                          const tags = [];
                          if (antworten?.[day]?.["Abendprogramm"]) tags.push("🌇 Abend");
                          if (antworten?.[day]?.["Schlafen"]) tags.push("🛏️ Schlafen");
                          return (
                            <td key={day} className="border p-2 text-center text-sm text-gray-700">
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

            <div className="mt-6 p-4 bg-white border rounded-lg shadow text-gray-800">
              <h2 className="text-xl font-semibold mb-4 text-center">🍽️ Essensübersicht</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {days.map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 border rounded-md px-4 py-2 shadow-sm text-sm text-center"
                  >
                    <p className="font-semibold text-gray-700 mb-1">{day}</p>
                    <p>🥩 Fleisch: <span className="font-bold">{essenPerDay[day]?.Fleisch || 0}</span></p>
                    <p>🥗 Vegi: <span className="font-bold">{essenPerDay[day]?.Vegi || 0}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}