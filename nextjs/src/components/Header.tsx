import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-10 h-24 flex items-center justify-center bg-transparent transition-all duration-300">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          <Link href="/">
            <svg className="w-32 h-8" viewBox="0 0 409.53 79.46">
              {/* SVG paths from original logo */}
              <path fill="#231f20" d="m32.11,6.53c0,6.84-3.24,11.28-4.82,11.66-.5-.37-1.66-9.15-6.41-9.06.07.63.29,1.94.29,3.38,0,8.97-6.48,22.59-6.48,23.27,0,15.32,5.04,18.93,5.54,19.32-1.01,1.27-5.47,4.23-9.15,5.39-.22,0-1.08-.38-1.3-.53-.58-.97-1.15-2.65-1.15-6.47,0-9.89,5.26-21.9,5.26-22.53,0-11.74-2.3-16.15-2.81-17-1.73,4-4.68,9.91-8.64,11.33C.43,26.02,0,25.4,0,24.75c0-5.69,2.45-11.06,4.1-12.28.5.33,2.09,2.49,6.05,1.22,4.61-1.47,10.23-6.31,15.84-7.58,4.18-.92,6.12-.22,6.12.42Z"/>
              {/* Add other SVG paths from original logo */}
            </svg>
          </Link>
        </h1>

        <nav>
          <ul className="flex items-center space-x-4">
            <li>
              <button
                onClick={() => {
                  setIsFormOpen(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 border-2 border-pink-400 rounded-md hover:bg-pink-400 hover:text-white transition-colors"
              >
                Submit Request
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
} 