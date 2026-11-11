export default function LoginPage() {
  async function handleLogin(e: FormData) {
    const email = e.get("email");
    const password = e.get("password");
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md rounded-xl border border-black/15 shadow-lg p-8 space-y-6">
        <h1 className="font-bold text-2xl text-gray-900 text-center">Login</h1>

        <form className="flex flex-col gap-4" action={(e) => handleLogin(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="email"
              name="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="password"
              name="password"
            />
          </div>

          <button
            className="w-full py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
