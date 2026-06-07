'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Users, FileText, BarChart3, Settings, LogOut, ChevronDown } from 'lucide-react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null | 'none'>(null);
  const pathname = usePathname();

  const activeExpandedMenu = pathname?.startsWith('/dashboard/content')
    ? expandedMenu === 'none'
      ? null
      : 'content'
    : expandedMenu === 'none'
      ? null
      : expandedMenu;

  const menuItems = [
    { icon: Users, label: 'Users Management', href: '/dashboard/users', id: 'users' },
    {
      icon: FileText,
      label: 'Content Management',
      id: 'content',
      href: '#',
      submenu: [
        { label: 'My Journey', href: '/dashboard/content/my-journey' },
        { label: 'Lessons', href: '/dashboard/content/lessons' },
        { label: 'Playing Game', href: '/dashboard/content/game' },
      ],
    },
    { icon: BarChart3, label: 'Progress Viewer', href: '/dashboard/progress', id: 'progress' },
    { icon: Settings, label: 'Setting', href: '/dashboard/settings', id: 'settings' },
  ];

  const isActive = (href: string) => {
    if (href === '#') return false;
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <div>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white hover:bg-gray-100 shadow-md"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 lg:translate-x-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            🐺
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">My Shepherd</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <>
                  <button
                    onClick={() => setExpandedMenu(expandedMenu === item.id ? null : item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                      isActive(item.submenu[0].href) || expandedMenu === item.id
                        ? 'bg-black text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${expandedMenu === item.id ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expandedMenu === item.id && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                            isActive(sub.href)
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          <span>{sub.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href!}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.href!)
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              console.log('Logout clicked – implement your logout logic');
              // Example: signOut() from next-auth, or call your API
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}