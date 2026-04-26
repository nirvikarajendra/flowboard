import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
      <h1
        className="font-bold text-xl cursor-pointer"
        onClick={() => navigate('/dashboard')}
      >
        Flowboard
      </h1>
      <button
        className="bg-white text-blue-600 px-4 py-2 rounded text-sm font-bold"
        onClick={() => {
          localStorage.removeItem('token')
          navigate('/login')
        }}
      >
        Logout
      </button>
    </nav>
  )
}

export default Navbar