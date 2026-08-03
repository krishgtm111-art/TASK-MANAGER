import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Dashboard from './pages/admin/Dashboard'
import ManageTasks from './pages/admin/ManageTasks'
import ManageUsers from './pages/admin/ManageUsers'
import CreateTask from './pages/admin/CreateTask'
import PrivateRoute from './routes/PrivateRoute'
import UserDashboard from './pages/user/UserDashboard'
import MyTasks from './pages/user/MyTasks'
import TaskDetails from './pages/user/TaskDetails'
import Home from './pages/Home'
import Payment from './pages/payment/Payment'
import PaymentSuccess from './pages/payment/PaymentSuccess'
import PaymentFailure from './pages/payment/PaymentFailure'
import Navbar from './components/Navbar'


const App = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* eSewa (test) payment demo */}
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failure" element={<PaymentFailure />} />

          {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
           <Route path="/admin/dashboard" element={<Dashboard />} />
           <Route path="/admin/tasks" element={<ManageTasks />} />
           <Route path="/admin/users" element={<ManageUsers />} />
           <Route path="/admin/create-task" element={<CreateTask />} />
          </Route>

          {/* User Routes */}
          <Route element={<PrivateRoute allowedRoles={['user']} />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/tasks" element={<MyTasks />} />
            <Route path="/user/task-details/:id" element={<TaskDetails />} />
          </Route>
         
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App