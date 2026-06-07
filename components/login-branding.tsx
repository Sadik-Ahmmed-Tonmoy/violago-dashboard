import Image from 'next/image'

export function LoginBranding() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden bg-black">
        <Image
          src="/shepherd-logo.png"
          alt="My Shepherd Logo"
          width={96}
          height={96}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center">My Shepherd</h2>
    </div>
  )
}
