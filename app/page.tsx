import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold text-gray-900">
          Dashboard de Vendas
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl">
          Sistema de gestão de vendas e dashboard para consultores e clientes
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              ✅ Next.js 15
            </h2>
            <p className="text-sm text-gray-600">App Router configurado</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              ✅ Tailwind CSS
            </h2>
            <p className="text-sm text-gray-600">Estilização configurada</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              ✅ Prisma ORM
            </h2>
            <p className="text-sm text-gray-600">PostgreSQL (Supabase)</p>
          </div>
        </div>
        <div className="pt-6">
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Acessar Dashboard →
          </Link>
        </div>
        <p className="text-sm text-gray-500 pt-4">
          Pronto para desenvolvimento! 🚀
        </p>
      </div>
    </div>
  );
}
