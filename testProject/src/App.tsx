import { useState } from 'react'
import './App.css'

interface Todo {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [category, setCategory] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input.trim(), 
        completed: false,
        priority,
        category: category.trim() || 'General'
      }])
      setInput('')
      setCategory('')
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const saveEdit = (id: number) => {
    if (editText.trim()) {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, text: editText.trim() } : todo
      ))
    }
    setEditingId(null)
    setEditText('')
  }

  const changePriority = (id: number, newPriority: 'low' | 'medium' | 'high') => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, priority: newPriority } : todo
    ))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-900 border-red-700'
      case 'medium': return 'bg-yellow-900 border-yellow-700'
      case 'low': return 'bg-green-900 border-green-700'
      default: return 'bg-gray-700 border-gray-600'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const stats = {
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black py-8 px-4 text-white">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
            ✨ Interactive Todo List ✨
          </h1>
          <p className="text-gray-300">Stay organized and productive!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center transform hover:scale-105 transition-transform border border-gray-700">
            <div className="text-3xl font-bold text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Tasks</div>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center transform hover:scale-105 transition-transform border border-gray-700">
            <div className="text-3xl font-bold text-orange-400">{stats.active}</div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-4 text-center transform hover:scale-105 transition-transform border border-gray-700">
            <div className="text-3xl font-bold text-green-400">{stats.completed}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-700">
          {/* Add Todo Form */}
          <div className="mb-6">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 transition-colors bg-gray-700 text-white placeholder-gray-400"
              />
              <button
                onClick={addTodo}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Add
              </button>
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Category (optional)"
                className="flex-1 px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-400 text-sm bg-gray-700 text-white placeholder-gray-400"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-400 text-sm bg-gray-700 text-white"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>

          {/* Filters */}
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-600">
            <div className="flex gap-2">
              {(['all', 'active', 'completed'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === f 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {stats.completed > 0 && (
              <button
                onClick={clearCompleted}
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                Clear Completed
              </button>
            )}
          </div>

          {/* Todo List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-400">No todos yet. Start adding some!</p>
              </div>
            ) : (
              filteredTodos.map(todo => (
                <div
                  key={todo.id}
                  className={`group border-2 rounded-lg p-4 transition-all hover:shadow-lg ${getPriorityColor(todo.priority)} ${
                    todo.completed ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="mt-1 h-5 w-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    />
                    
                    <div className="flex-1">
                      {editingId === todo.id ? (
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                          onBlur={() => saveEdit(todo.id)}
                          className="w-full px-2 py-1 border border-purple-300 rounded focus:outline-none focus:border-purple-500 bg-gray-700 text-white"
                          autoFocus
                        />
                      ) : (
                        <div>
                          <p className={`text-gray-100 font-medium ${todo.completed ? 'line-through' : ''}`}>
                            {todo.text}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs px-2 py-1 bg-blue-900 text-blue-200 rounded-full border border-blue-700">
                              {todo.category}
                            </span>
                            <span className={`text-xs px-2 py-1 ${getPriorityBadge(todo.priority)} text-white rounded-full`}>
                              {todo.priority}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(todo)}
                        className="p-2 text-blue-400 hover:bg-blue-900 rounded transition-colors"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <select
                        value={todo.priority}
                        onChange={(e) => changePriority(todo.id, e.target.value as 'low' | 'medium' | 'high')}
                        className="text-xs px-2 rounded border border-gray-600 focus:outline-none focus:border-purple-400 bg-gray-700 text-white"
                        title="Change Priority"
                      >
                        <option value="low">🟢</option>
                        <option value="medium">🟡</option>
                        <option value="high">🔴</option>
                      </select>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="p-2 text-red-400 hover:bg-red-900 rounded transition-colors"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>💡 Tip: Hover over tasks to see more options!</p>
        </div>
      </div>
    </div>
  )
}

export default App
