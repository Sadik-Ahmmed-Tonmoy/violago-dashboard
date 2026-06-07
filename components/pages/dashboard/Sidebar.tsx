'use client'

import { useState } from 'react'
import { Menu, X, Users, FileText, BarChart3, Settings, LogOut, ChevronDown } from 'lucide-react'

export function Sidebar({ activeMenu = 'users' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState(activeMenu === 'content' ? 'content' : null)

  const menuItems = [
    { icon: Users, label: 'Users Management', id: 'users', active: activeMenu === 'users' },
    { 
      icon: FileText, 
      label: 'Content Management', 
      id: 'content',
      active: activeMenu === 'content',
      submenu: [
        { label: 'My Journey', id: 'journey' },
        { label: 'Lessons', id: 'lessons' },
        { label: 'Playing Game', id: 'game' }
      ]
    },
    { icon: BarChart3, label: 'Progress Viewer', id: 'progress', active: activeMenu === 'progress' },
    { icon: Settings, label: 'Setting', id: 'settings', active: activeMenu === 'settings' },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white hover:bg-gray-100"
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
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 lg:translate-x-0 lg:relative flex flex-col ${
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
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => item.submenu && setExpandedMenu(expandedMenu === item.id ? null : item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.submenu && (
                  <ChevronDown 
                    size={18} 
                    className={`ml-auto transition ${expandedMenu === item.id ? 'rotate-180' : ''}`}
                  />
                )}
              </button>
              {item.submenu && expandedMenu === item.id && (
                <div className="ml-4 mt-1 space-y-1">
                  {item.submenu.map((subitem) => (
                    <button
                      key={subitem.id}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
                        subitem.id === 'journey'
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      <span>{subitem.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
