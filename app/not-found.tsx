// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-5xl font-bold text-indigo-700 mb-4">404</h1>
      <p className="text-lg text-gray-700 mb-6">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="text-indigo-600 underline font-semibold">Go Home</a>
    </div>
  );
}
