import { Users, FileText, Heart, Eye } from "lucide-react"
import { StatCardAdmin } from "@/components/stat-card-admin"

export default function PageAdmin() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCardAdmin title="Users" value="18" icon={Users} iconColor="text-rose-500" iconBgColor="bg-rose-100" />
      <StatCardAdmin title="Scrap" value="248" icon={FileText} iconColor="text-teal-500" iconBgColor="bg-teal-100" />
      <StatCardAdmin title="Likes" value="22,627" icon={Heart} iconColor="text-blue-500" iconBgColor="bg-blue-100" />
      <StatCardAdmin title="Viewers" value="427K" icon={Eye} iconColor="text-amber-500" iconBgColor="bg-amber-100" />
    </div>
  )
}

