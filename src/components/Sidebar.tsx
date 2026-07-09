'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import {
  LayoutDashboard,
  FileBarChart2,
  Users,
  Bot,
  TruckIcon,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  AlertTriangle,
  Bell,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const navGroups = [
  {
    label: 'Analytics',
    items: [
      { label: 'Risk Dashboard', href: '/', icon: LayoutDashboard, badge: 3 },
      { label: 'Risk Reports', href: '/risk-reports', icon: FileBarChart2, badge: null },
      { label: 'Customer Risk', href: '/customer-risk-management', icon: Users, badge: 12 },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Supplier & Employees', href: '/supplier-employee-analytics', icon: TruckIcon, badge: 2 },
      { label: 'AI Assistant', href: '/ai-assistant', icon: Bot, badge: null },
    ],
  },
];

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`
        flex flex-col flex-shrink-0 h-full bg-card border-r border-border sidebar-transition z-50
        ${collapsed ? 'w-16' : 'w-60'}
        fixed lg:relative
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo area */}
      <div className={`flex items-center h-14 border-b border-border flex-shrink-0 ${collapsed ? 'justify-center px-0' : 'px-4 gap-2'}`}>
        <AppLogo size={28} />
        {!collapsed && (
          <span className="font-semibold text-foreground text-sm tracking-tight truncate">RetailRisk</span>
        )}
        {/* Mobile close */}
        {!collapsed && (
          <button
            onClick={onMobileClose}
            className="ml-auto p-1 text-muted-foreground hover:text-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Alert banner */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-2 rounded bg-negative-bg border border-primary/30 flex items-center gap-2">
          <AlertTriangle size={13} className="text-primary flex-shrink-0" />
          <span className="text-xs text-primary font-medium">3 critical flags active</span>
        </div>
      )}
      {collapsed && (
        <div className="flex justify-center mt-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navGroups.map((group) => (
          <div key={`group-${group.label}`} className="mb-4">
            {!collapsed && (
              <p className="px-2 mb-1 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={`nav-${item.href}`}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-2 py-2 rounded-md mb-0.5 transition-all duration-150 group relative
                    ${active
                      ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium truncate">{item.label}</span>
                      {item.badge !== null && (
                        <span className={`ml-auto text-xs font-semibold px-1.5 py-0.5 rounded-full tabular-nums ${active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge !== null && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-border p-2 space-y-1 flex-shrink-0">
        <button
          className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Notifications' : undefined}
        >
          <Bell size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Notifications</span>}
        </button>
        <button
          className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </button>

        {/* User profile */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-2 py-2 mt-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary">MK</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-foreground truncate">Marcus Kim</p>
              <p className="text-xs text-muted-foreground truncate">Finance Manager</p>
            </div>
            <button className="p-1 text-muted-foreground hover:text-primary transition-colors" title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center py-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">MK</span>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}