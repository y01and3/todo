import React from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import AddTodo from "./page/AddTodo"
import EditTodo from "./page/EditTodo"
import TodoDetail from "./page/TodoDetail"
import Home from "./page/Home"
import Todo from "./page/Todo"

const MyApp = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/todo">Todo List</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/todo/add" element={<AddTodo />} />
        <Route path="/todo/:id/edit" element={<EditTodo />} />
        <Route path="/todo/:id" element={<TodoDetail />} />
      </Routes>
    </Router>
  )
}

export default MyApp
