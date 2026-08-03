import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50 dark:bg-slate-950 transition-colors px-4 py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center shadow-sm dark:shadow-none">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Admin Dashboard</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Welcome back, {user?.name}. You're logged in as an admin.</p>
        <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">Task management screens are still a work in progress.</p>
      </div>
    </div>
  )
}

export default Dashboard
