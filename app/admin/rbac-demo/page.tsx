'use client'

import React, { useState } from 'react'
import { EnhancedAdminAuthGate, RoleSwitcher } from '@/components/admin/enhanced-admin-auth-gate'
import { ConditionalButton, PermissionGuard, RoleGuard, ActionGuard } from '@/components/ui/permission-guard'
import { useRBAC } from '@/hooks/use-rbac'
import { AdminRole, Permission } from '@/lib/rbac'

export default function RBACDemoPage() {
  const [currentSection, setCurrentSection] = useState('overview')
  const { user, permissions, hasPermission, canAccessSection, canPerformAction } = useRBAC({
    id: '1',
    email: 'admin@bfng.com.gh',
    name: 'Demo Admin',
    role: 'super_admin', // This will be controlled by the role switcher
    permissions: ['*']
  })

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Current User Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Name</p>
            <p className="font-medium">{user?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-medium">{user?.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Permissions Count</p>
            <p className="font-medium">{permissions.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Permission Tests</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Can create products?</span>
            <span className={`px-2 py-1 rounded text-sm ${canPerformAction('create-product') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {canPerformAction('create-product') ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Can approve vendor products?</span>
            <span className={`px-2 py-1 rounded text-sm ${canPerformAction('approve-vendor-product') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {canPerformAction('approve-vendor-product') ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Can access payments?</span>
            <span className={`px-2 py-1 rounded text-sm ${canAccessSection('/admin/payments') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {canAccessSection('/admin/payments') ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Can confirm payments?</span>
            <span className={`px-2 py-1 rounded text-sm ${hasPermission('payments.confirm') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {hasPermission('payments.confirm') ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Role-Based UI Elements</h2>
        <div className="space-y-4">
          <PermissionGuard permission="products.create">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Create Product (Requires products.create)
            </button>
          </PermissionGuard>

          <ActionGuard action="approve-vendor-product">
            <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Approve Vendor Product (Requires approve-vendor-product action)
            </button>
          </ActionGuard>

          <RoleGuard roles={['operations', 'super_admin']}>
            <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
              Operations Only (Requires operations or super_admin role)
            </button>
          </RoleGuard>

          <ConditionalButton
            action="confirm-payment"
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            fallback={
              <button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed">
                Confirm Payment (Permission Required)
              </button>
            }
          >
            Confirm Payment (Requires confirm-payment action)
          </ConditionalButton>
        </div>
      </div>
    </div>
  )

  const renderSectionAccess = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Section Access Test</h2>
        <div className="space-y-3">
          {Object.entries({
            '/admin': 'Dashboard',
            '/admin/orders': 'Orders',
            '/admin/products': 'Products',
            '/admin/vendors': 'Vendors',
            '/admin/vendor-products': 'Vendor Products',
            '/admin/payments': 'Payments',
            '/admin/delivery-assignments': 'Delivery Assignments',
            '/admin/subscriptions': 'Subscriptions',
            '/admin/analytics': 'Analytics',
            '/admin/settings': 'Settings'
          }).map(([path, name]) => (
            <div key={path} className="flex items-center justify-between">
              <span>{name}</span>
              <span className={`px-2 py-1 rounded text-sm ${canAccessSection(path) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {canAccessSection(path) ? 'Accessible' : 'Restricted'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPermissionMatrix = () => {
    const allPermissions: Permission[] = [
      'products.create',
      'products.update',
      'products.delete',
      'vendors.create',
      'vendors.update',
      'vendor_products.approve',
      'vendor_products.reject',
      'orders.assign',
      'orders.update',
      'payments.confirm',
      'deliveries.assign',
      'subscriptions.update',
      'analytics.read',
      'reports.export'
    ]

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Permission Matrix</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permission</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allPermissions.map(permission => (
                  <tr key={permission}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {permission}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${hasPermission(permission) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {hasPermission(permission) ? 'Granted' : 'Denied'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <EnhancedAdminAuthGate requiredRole="super_admin">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">RBAC Demo</h1>
          <p className="text-gray-600">Test role-based access control functionality</p>
        </div>

        {/* Role Switcher */}
        <RoleSwitcher />

        {/* Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setCurrentSection('overview')}
              className={`px-4 py-2 rounded ${currentSection === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentSection('sections')}
              className={`px-4 py-2 rounded ${currentSection === 'sections' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Section Access
            </button>
            <button
              onClick={() => setCurrentSection('permissions')}
              className={`px-4 py-2 rounded ${currentSection === 'permissions' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Permission Matrix
            </button>
          </nav>
        </div>

        {/* Content */}
        {currentSection === 'overview' && renderOverview()}
        {currentSection === 'sections' && renderSectionAccess()}
        {currentSection === 'permissions' && renderPermissionMatrix()}
      </div>
    </EnhancedAdminAuthGate>
  )
}
