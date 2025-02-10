import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-white text-blue-600 h-16 px-6 flex items-center justify-start border-b-2 shadow-lg">
        <h1 className="text-2xl font-bold">PURCHASE CHAIN</h1>
      </div>

      <div className="flex-auto flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <h2 className="text-6xl font-semibold">Welcome to Purchase Chain</h2>
          <h3 className="text-lg text-gray-700 mt-2">Simplify your procurement process today!</h3>
        </div>

        <div className="px-6 mt-6">
          <Link
            href="/login"
            className="bg-blue-500 p-3 rounded-sm text-white hover:bg-blue-600 transition duration-300"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}