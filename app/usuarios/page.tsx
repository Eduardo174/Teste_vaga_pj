"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Client {
  id: string;
  name: string;
  email: string;
  consultorId?: string | null;
}

export default function CreateUser() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "clients">("info");
  const [loading, setLoading] = useState(false);
  const [allClients, setAllClients] = useState<Client[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [formData, setFormData] = useState({
    tipo: "",
    nome: "",
    telefone: "",
    email: "",
    idade: "",
    cpf: "",
    cep: "",
    estado: "",
    endereco: "",
    complemento: "",
    clientesVinculados: [] as string[],
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      const data = await response.json();
      
      const clientesSemConsultor = (data.clients || []).filter(
        (client: Client) => !client.consultorId
      );
      
      setAllClients(clientesSemConsultor);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          cpf: formData.cpf,
          idade: formData.idade ? parseInt(formData.idade) : null,
          endereco: formData.endereco + (formData.complemento ? `, ${formData.complemento}` : ""),
          role: formData.tipo,
          clientIds: formData.clientesVinculados,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Usuário criado com sucesso!");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setErrorMessage(data.error || "Erro ao criar usuário");
      }
    } catch (error) {
      console.error("Erro:", error);
      setErrorMessage("Erro ao criar usuário. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleClientToggle = (clientId: string) => {
    setFormData((prev) => ({
      ...prev,
      clientesVinculados: prev.clientesVinculados.includes(clientId)
        ? prev.clientesVinculados.filter((id) => id !== clientId)
        : [...prev.clientesVinculados, clientId],
    }));
  };

  // Máscaras de input
  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header />

      <main className="max-w-[800px] mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => router.push("/usuarios")}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Criar usuário
          </button>
          <button className="bg-[#141414] hover:bg-[#1a1a1a] border border-gray-800 px-6 py-2 rounded-lg text-sm font-medium transition-colors">
            Deletar usuário
          </button>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold mb-6">Criar usuário</h1>

        {/* Mensagens de erro e sucesso */}
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
            {successMessage}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
          {/* Tipo de usuário */}
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2">
              Tipo do usuário
            </label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-600"
              required
            >
              <option value="">Selecione o tipo do usuário</option>
              <option value="ADMIN">Admin</option>
              <option value="CONSULTOR">Consultor</option>
              <option value="CLIENT">Cliente</option>
            </select>
          </div>

          {/* Tabs Info / Clientes */}
          <div className="flex gap-2 mb-6 border-b border-gray-800">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "info"
                  ? "text-white border-b-2 border-gray-400"
                  : "text-gray-500"
              }`}
            >
              Informações básicas
            </button>
            {formData.tipo === "CONSULTOR" && (
              <button
                type="button"
                onClick={() => setActiveTab("clients")}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "clients"
                    ? "text-white border-b-2 border-gray-400"
                    : "text-gray-500"
                }`}
              >
                Adicionar clientes
              </button>
            )}
          </div>

          {/* Tab: Informações básicas */}
          {activeTab === "info" && (
            <div className="space-y-6">
              {/* Nome e Telefone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Nome
                  </label>
                  <input
                    type="text"
                    placeholder="Digite o nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    placeholder="Digite o telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                    maxLength={15}
                    className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Digite o email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  required
                />
              </div>

              {/* Idade e CPF */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Idade
                  </label>
                  <input
                    type="text"
                    placeholder="28 anos"
                    value={formData.idade}
                    onChange={(e) => setFormData({ ...formData, idade: e.target.value })}
                    className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                    maxLength={14}
                    className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
              </div>

              {/* CEP e Estado */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    CEP
                  </label>
                  <input
                    type="text"
                    placeholder="Insira o CEP"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: formatCEP(e.target.value) })}
                    maxLength={9}
                    className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-gray-600"
                  >
                    <option value="">Selecione o estado</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="BA">Bahia</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="RS">Rio Grande do Sul</option>
                  </select>
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  placeholder="Digite o endereço"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
              </div>

              {/* Complemento */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Complemento
                </label>
                <input
                  type="text"
                  placeholder="Digite o complemento"
                  value={formData.complemento}
                  onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                  className="w-full bg-[#141414] border border-gray-800 rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-gray-600"
                />
              </div>
            </div>
          )}

          {/* Tab: Adicionar clientes (apenas se for Consultor) */}
          {activeTab === "clients" && formData.tipo === "CONSULTOR" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-4">
                Selecione os clientes que deseja vincular a este consultor:
              </p>
              
              {allClients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Nenhum cliente disponível
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {allClients.map((client) => (
                    <label
                      key={client.id}
                      className="flex items-center gap-3 p-3 bg-[#141414] border border-gray-800 rounded-lg hover:bg-[#1a1a1a] cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.clientesVinculados.includes(client.id)}
                        onChange={() => handleClientToggle(client.id)}
                        className="w-4 h-4 rounded border-gray-700 bg-[#0a0a0a] text-green-600 focus:ring-green-600"
                      />
                      <div className="flex-1">
                        <p className="text-white text-sm">{client.name}</p>
                        <p className="text-gray-500 text-xs">{client.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Botões */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-6 py-2.5 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar usuário"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
