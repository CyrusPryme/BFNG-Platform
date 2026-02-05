import { AdminAuthGate, useMockAuth } from '../components/AdminAuthGate'

export default function SettingsPage() {
  return (
    <AdminAuthGate>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your admin panel preferences and system settings.</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center py-12">
            <p className="text-gray-500">Settings interface - Administrator access</p>
            <p className="text-sm text-gray-400 mt-2">This page is accessible to administrators with ADMIN role</p>
          </div>
        </div>
      </div>
    </AdminAuthGate>
  )
}
