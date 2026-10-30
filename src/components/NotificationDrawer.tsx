import React from 'react';
import { X, Bell, Droplet, CheckCheck, Clock, ArrowRight } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-950/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-rose-600" />
            <h3 className="font-bold text-neutral-900 text-sm">Emergency Dispatch Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-neutral-500 hover:text-neutral-900 font-medium"
              title="Mark all as read"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 p-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`p-3.5 rounded-xl cursor-pointer transition-colors space-y-1.5 ${
                notif.read ? 'hover:bg-neutral-50' : 'bg-rose-50/50 hover:bg-rose-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-900 flex items-center gap-1.5">
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />}
                  {notif.title}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">{notif.timestamp}</span>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed">
                {notif.message}
              </p>

              {notif.bloodGroup && (
                <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
                  <span className="font-mono font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    {notif.bloodGroup}
                  </span>
                  {notif.hospital && <span>· {notif.hospital}</span>}
                  {notif.city && <span>· {notif.city}</span>}
                </div>
              )}
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-8 text-center text-neutral-500 text-xs">
              No recent notifications.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100 bg-neutral-50 text-xs text-neutral-500 text-center">
          Real-time alerts sync across verified hospitals and active donors.
        </div>
      </div>
    </div>
  );
};
