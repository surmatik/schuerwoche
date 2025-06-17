// pages/index.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Client, Databases, ID } from "appwrite";
import CeviLogo from "../../public/cevi-logo.png";

const days = ["6. Juli", "7. Juli", "8. Juli", "9. Juli", "10. Juli", "11. Juli", "12. Juli"];
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
    <div className="min-h-screen bg-gradient-to-br from-[#fefefe] to-[#f2f2f2] font-['Segoe UI','Helvetica Neue',sans-serif]">
      <header className="flex items-center justify-center p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Image src={CeviLogo} alt="Cevi Logo" width={40} height={40} />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Schüürwuche 2025</h1>
        </div>
      </header>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-white text-black rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-1">
              Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Dein Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#b10030]"
            />
          </div>

          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="deinemail@cevi-wetzikon.ch"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#b10030]"
            />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-3">Wann bist du dabei?</h2>
          <div className="overflow-x-auto">
            <table className="w-full border text-sm text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="border p-2">Datum</th>
                  {options.map((opt) => (
                    <th key={opt} className="border p-2">{opt}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day} className="hover:bg-gray-50">
                    <td className="border p-2 text-left font-medium">{day}</td>
                    {options.map((opt) => (
                      <td className="border p-2" key={opt}>
                        <input
                          type="checkbox"
                          checked={!!(formData as any)?.[day]?.[opt]}
                          onChange={() => handleChange(day, opt)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-10 mb-3">Was isst du?</h2>
          <table className="w-full border mb-6 text-sm text-center">
            <thead className="bg-gray-100 text-gray-700">
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
            className="mt-4 w-full bg-[#b10030] hover:bg-[#970029] text-white font-semibold py-3 px-4 rounded-lg text-lg shadow"
          >
            Senden
          </button>
        </div>
      </main>
    </div>
  );
}