import React from 'react';
import { BottomNav } from '../components/BottomNav';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { WebsiteHeader } from '../components/WebsiteHeader';

export function MainLayout({ children, showBottomNav = true, currentRole, onRoleChange }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />
      <WebsiteHeader currentRole={currentRole} />
      <div className="w-full min-h-screen">
        {children}
        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}