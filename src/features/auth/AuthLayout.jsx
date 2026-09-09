export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F2FF] dark:bg-[#0F0F14] px-4 py-10 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-[#1A1A22] rounded-2xl shadow-sm p-6 sm:p-8 transition-colors">
        <h1 className="text-xl sm:text-2xl font-bold text-[#6C63FF] mb-1">
          {title}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">
          {subtitle}
        </p>
        {children}
      </div>
    </div>
  );
}
