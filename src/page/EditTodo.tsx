import React from "react"
import { useParams } from "react-router-dom"

const EditTodo = () => {
  const id = Number(useParams<{ id: string }>()["id"])
  return <div>EditTodo {id}</div>
}

export default EditTodo
