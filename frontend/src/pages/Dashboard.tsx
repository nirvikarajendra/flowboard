import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import type { Board } from '../types'
import Navbar from '../components/Navbar'

function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([])
  const [newBoardName, setNewBoardName] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchBoards()
  }, [])

  const fetchBoards = async () => {
    try {
      const res = await api.get('/boards')
      setBoards(res.data)
    } catch (err) {
      console.log("Error fetching boards:", err)
    }
  }

  const createBoard = async () => {
    if (newBoardName.trim() === "") return
    try {
      const res = await api.post('/boards', { name: newBoardName })
      setBoards([...boards, res.data])
      setNewBoardName("")
    } catch (err) {
      console.log("Error creating board:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">My Boards</h2>
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="New board name..."
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            className="p-2 border rounded text-sm w-64"
          />
          <button
            onClick={createBoard}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-bold"
          >
            Create Board
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {boards.map((board) => (
            <div
              key={board.id}
              onClick={() => navigate(`/board/${board.id}`)}
              className="bg-white p-6 rounded-lg shadow-sm cursor-pointer hover:shadow-md"
            >
              <h3 className="font-bold">{board.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard