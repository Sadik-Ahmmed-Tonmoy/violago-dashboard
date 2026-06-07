interface HeaderProps {
  title?: string
}

export function Header({ title = 'Users Management' }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-6 bg-white border-b border-gray-200">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 hidden md:block">{title}</h1>
      </div>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:shadow-lg transition">
        👤
      </div>
    </header>
  )
}
