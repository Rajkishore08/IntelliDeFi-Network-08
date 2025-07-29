"use client"

import { useNotification } from "@/contexts/NotificationContext"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export default function NotificationsBar() {
  const { notifications, removeNotification } = useNotification()

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => {
        const getIcon = () => {
          switch (notification.type) {
            case "success":
              return <CheckCircle className="h-5 w-5 text-green-400" />
            case "error":
              return <AlertCircle className="h-5 w-5 text-red-400" />
            case "warning":
              return <AlertTriangle className="h-5 w-5 text-yellow-400" />
            default:
              return <Info className="h-5 w-5 text-blue-400" />
          }
        }

        const getBorderColor = () => {
          switch (notification.type) {
            case "success":
              return "border-green-400/50"
            case "error":
              return "border-red-400/50"
            case "warning":
              return "border-yellow-400/50"
            default:
              return "border-blue-400/50"
          }
        }

        return (
          <div
            key={notification.id}
            className={`glass-panel border ${getBorderColor()} shadow-lg p-4 animate-slide-in-right`}
          >
            <div className="flex items-start space-x-3">
              {getIcon()}
              <div className="flex-1">
                <p className="text-sm text-white">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
