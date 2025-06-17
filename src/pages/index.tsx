// pages/index.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Client, Databases, ID } from "appwrite";
import CeviLogo from "../../public/cevi-logo.png";

const days = [
  ["6. Juli", "Sonntag"],
  ["7. Juli", "Montag"],
  ["8. Juli", "Dienstag"],
  ["9. Juli", "Mittwoch"],
  ["10. Juli", "Donnerstag"],
  ["11. Juli", "Freitag"],
  ["12. Juli", "Samstag"],
];
const options = ["Abendprogramm", "Schlafen"];
const foodOptions = ["Fleisch", "Vegi"];

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("6851b3080024374d0ade");

const databases = new Databases(client);
const databaseId = "6851b31000348b1557df";
const collectionId = "6851b3c1002759f58afe";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({});
  const [essen, setEssen] = useState("");
  const router = useRouter();

  const handleChange = (day: string, option: string) => {
    setFormData((prev) => ({
      ...prev,
      [day]: {
        ...(prev as any)[day],
        [option]: !(prev as any)?.[day]?.[option],
      },
    }));
  };

  const handleSubmit = async () => {
    if (!name.trim()) return alert("Bitte Namen eingeben.");

    try {
      await databases.createDocument(databaseId, collectionId, ID.unique(), {
        name,
        email,
        essen,
        antworten: JSON.stringify(formData),
      });
      router.push("/auswertung");
    } catch (err) {
      console.error("Appwrite Fehler:", err);
      alert("Fehler beim Speichern. Bitte später erneut versuchen.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f6fa] to-[#eceff5] font-['Segoe UI','Helvetica Neue',sans-serif]">
      <div className="flex justify-center pt-10">
        <header className="w-full max-w-4xl bg-white shadow-md rounded-3xl">
          <div className="px-6 pt-6 pb-3 flex items-center gap-4">
            <Image src={CeviLogo} alt="Cevi Logo" width={40} height={40} />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Schüürwuche 2025</h1>
              <span className="text-sm text-gray-500">Cevi Wetzikon</span>
            </div>
          </div>
          <div className="bg-[#f5f5f5] text-sm text-gray-700 py-2 px-6 text-center shadow-inner rounded-b-3xl">
            👉 Du willst wissen, wer sonst dabei ist? <Link href="/auswertung" className="text-[#b10030] font-semibold underline hover:text-[#8e0026]">Hier geht's zu den Anmeldungen</Link>
          </div>
        </header>
      </div>

      <main className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white text-gray-800 rounded-3xl shadow-xl p-10 border border-gray-200">
          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-1">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Dein Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-2xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-[#b10030] bg-[#f9f9fb]"
            />
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="deinemail@cevi-wetzikon.ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-2xl p-4 w-full focus:outline-none focus:ring-2 focus:ring-[#b10030] bg-[#f9f9fb]"
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-3">Wann bist du dabei?</h2>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm text-center rounded-xl overflow-hidden">
              <thead className="bg-[#f0f0f5] text-gray-700">
                <tr>
                  <th className="border p-2">Datum</th>
                  {options.map((opt) => (
                    <th key={opt} className="border p-2">{opt}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map(([day, wochentag]) => (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="border p-2 text-left font-medium">
                      {day} <span className="text-gray-500 text-sm">({wochentag})</span>
                    </td>
                    {options.map((opt) => (
                      <td className="border p-2" key={opt}>
                        <input
                          type="checkbox"
                          checked={!!(formData as any)?.[day]?.[opt]}
                          onChange={() => handleChange(day, opt)}
                          disabled={day === "12. Juli" && opt === "Schlafen"}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-3">Was isst du?</h2>
          <table className="w-full border mb-6 text-sm text-center rounded-xl overflow-hidden">
            <thead className="bg-[#f0f0f5] text-gray-700">
              <tr>
                <th className="border p-2"></th>
                {foodOptions.map((opt) => (
                  <th key={opt} className="border p-2">{opt}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50">
                <td className="border p-2 font-medium text-left">Essen</td>
                {foodOptions.map((opt) => (
                  <td key={opt} className="border p-2">
                    <input
                      type="radio"
                      name="essen"
                      value={opt}
                      checked={essen === opt}
                      onChange={(e) => setEssen(e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          <button
            onClick={handleSubmit}
            className="mt-4 w-full bg-[#b10030] hover:bg-[#8e0026] text-white font-semibold py-3 px-4 rounded-2xl text-lg shadow-md transition duration-150"
          >
            Senden
          </button>
        </div>
      </main>
    </div>
  );
}
