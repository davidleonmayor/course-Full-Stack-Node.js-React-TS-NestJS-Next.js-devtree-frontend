export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700 mt-4">
        The page you are looking for does not exist.
      </p>
      <a href="/auth/login" className="mt-6 text-blue-500 hover:underline">
        Login
      </a>
    </div>
  );
}
