export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F2FF] px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl font-bold text-[#6C63FF] mb-1">{title}</h1>
        <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
