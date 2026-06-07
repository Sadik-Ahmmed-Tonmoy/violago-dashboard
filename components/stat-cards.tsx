import { Users, CheckCircle2, XCircle } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  bgColor: string
  iconBgColor: string
  textColor: string
}

function StatCard({ icon, label, value, bgColor, iconBgColor, textColor }: StatCardProps) {
  return (
    <div className={`${bgColor} p-6 rounded-2xl flex flex-col gap-4`}>
      <div className="flex items-center gap-3">
        <div className={`${iconBgColor} p-3 rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-4xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">Updated today</p>
      </div>
    </div>
  )
}

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-8 py-6">
      <StatCard
        icon={<Users className="text-green-600" size={24} />}
        label="Total Users"
        value={250}
        bgColor="bg-green-50"
        iconBgColor="bg-green-100"
        textColor="text-green-600"
      />
      <StatCard
        icon={<CheckCircle2 className="text-amber-600" size={24} />}
        label="Active Users"
        value={232}
        bgColor="bg-amber-50"
        iconBgColor="bg-amber-100"
        textColor="text-amber-600"
      />
      <StatCard
        icon={<XCircle className="text-rose-600" size={24} />}
        label="Inactive Users"
        value={18}
        bgColor="bg-rose-50"
        iconBgColor="bg-rose-100"
        textColor="text-rose-600"
      />
    </div>
  )
}
