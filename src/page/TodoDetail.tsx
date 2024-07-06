import React from "react"
import { useParams } from "react-router-dom"

const TodoDetail = () => {
  const id = Number(useParams<{ id: string }>()["id"])
  return <div>TodoDetail {id}</div>
}

export default TodoDetail
