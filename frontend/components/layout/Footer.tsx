'use client';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600">
            <p className="font-semibold text-gray-900">HeirLock</p>
            <p>Bitcoin Inheritance Platform on Internet Computer</p>
          </div>
          <div className="text-xs text-gray-500">
            <p>© {new Date().getFullYear()} HeirLock. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

