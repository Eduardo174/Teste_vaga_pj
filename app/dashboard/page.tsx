"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Client {
  id: string;
  name: string;
  email: string;
  telefone: string | null;
  cpf: string | null;
  idade: number | null;
  endereco: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Consultor {
  id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [consultores, setConsultores] = useState<Consultor[]>([]);
  const [selectedConsultor, setSelectedConsultor] = useState<string>("");
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [dateRange, setDateRange] = useState({
    start: "2025-10-21",
    end: "2025-12-21",
  });
  const [totalClients, setTotalClients] = useState(128);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConsultores();
    fetchClients();
  }, []);

  useEffect(() => {
    fetchClients();
  }, [selectedConsultor, dateRange]);

  const fetchConsultores = async () => {
    try {
      const response = await fetch("/api/consultores");
      const data = await response.json();
      setConsultores(data);
    } catch (error) {
      console.error("Erro ao buscar consultores:", error);
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedConsultor) {
        params.append("consultorId", selectedConsultor);
      }
      if (dateRange.start) {
        params.append("startDate", dateRange.start);
      }
      if (dateRange.end) {
        params.append("endDate", dateRange.end);
      }

      const response = await fetch(`/api/clients?${params.toString()}`);
      const data = await response.json();

      setClients(
        data.clients.map((client: any) => ({
          ...client,
          createdAt: new Date(client.createdAt).toLocaleString("pt-BR"),
          updatedAt: new Date(client.updatedAt).toLocaleString("pt-BR"),
        }))
      );
      setTotalClients(data.totalLast7Days);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <main className="max-w-[1400px] mx-auto px-10 py-10">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-[32px] font-semibold tracking-tight">Dashboard</h1>
          <button 
            onClick={() => router.push("/usuarios")}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1FB655] hover:bg-[#169645] px-5 py-2.5 text-sm font-medium text-white transition-colors"
          >
            Criar usuário
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10 text-base leading-none">
              +
            </span>
          </button>
        </div>
        <div className="mb-8">
          <div className="flex items-stretch gap-6">
            <div className="w-[230px] bg-[#111111] border border-[#242424] rounded-lg px-5 py-5 flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-[#9CA3AF] mb-2">
                  Total de clientes
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[40px] leading-none font-semibold">
                    {totalClients}
                  </span>
                  <span className="text-[#22C55E] text-lg leading-none">
                    ↗
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-[#6B7280] mt-3">
                nos últimos 7 dias
              </p>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <div className="flex-1">
                <label className="block mb-1 text-[11px] text-[#9CA3AF]">
                  Nome do consultor
                </label>
                <div className="relative">
                  <select
                    value={selectedConsultor}
                    onChange={(e) => setSelectedConsultor(e.target.value)}
                    className="w-full appearance-none bg-[#111111] border border-[#242424] rounded-lg px-4 pr-9 py-2.5 text-sm text-white focus:outline-none focus:border-[#4B5563]"
                  >
                    <option value="">Todos os consultores</option>
                    {consultores.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">
                    ▼
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <label className="block mb-1 text-[11px] text-[#9CA3AF]">
                  Email do consultor
                </label>
                <div className="relative">
                  <select
                    value={selectedEmail}
                    onChange={(e) => {
                      setSelectedEmail(e.target.value);
                      const consultor = consultores.find(
                        (c) => c.email === e.target.value
                      );
                      if (consultor) {
                        setSelectedConsultor(consultor.id);
                      }
                    }}
                    className="w-full appearance-none bg-[#111111] border border-[#242424] rounded-lg px-4 pr-9 py-2.5 text-sm text-white focus:outline-none focus:border-[#4B5563]"
                  >
                    <option value="">Todos os emails</option>
                    {consultores.map((c) => (
                      <option key={c.id} value={c.email}>
                        {c.email}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">
                    ▼
                  </span>
                </div>
              </div>

              <div className="flex-1">
                <label className="block mb-1 text-[11px] text-[#9CA3AF]">
                  Período
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className="flex-1 bg-[#111111] border border-[#242424] rounded-lg px-4 py-2.5 text-sm text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6]"
                  />
                  <span className="text-[#9CA3AF]">até</span>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className="flex-1 bg-[#111111] border border-[#242424] rounded-lg px-4 py-2.5 text-sm text-[#E5E7EB] focus:outline-none focus:border-[#3B82F6]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#111111] border border-[#242424] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#242424] bg-[#111111]">
                  <th className="text-left px-6 py-3 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                    Nome
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                    Telefone
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                    CPF
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                    Idade
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                    Endereço
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                    Criado em
                  </th>
                  <th className="text-left px-6 py-3 text-[11px] font-medium uppercase tracking-wide text-[#9CA3AF]">
                    Atualizado em
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-10 text-sm text-[#6B7280]"
                    >
                      Carregando...
                    </td>
                  </tr>
                ) : clients.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-center py-10 text-sm text-[#6B7280]"
                    >
                      Nenhum cliente encontrado
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr
                      key={client.id}
                      className="border-t border-[#242424] hover:bg-[#181818] transition-colors"
                    >
                      <td className="px-6 py-4 text-[13px]">{client.name}</td>
                      <td className="px-6 py-4 text-[13px] text-[#D1D5DB]">
                        {client.email}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#9CA3AF]">
                        {client.telefone || "-"}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#9CA3AF]">
                        {client.cpf || "-"}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#9CA3AF]">
                        {client.idade ? `${client.idade} anos` : "-"}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#9CA3AF]">
                        {client.endereco || "-"}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#9CA3AF]">
                        {client.createdAt}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-[#9CA3AF]">
                        {client.updatedAt}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
