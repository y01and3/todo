import type { MenuProps } from "antd"
import { Menu } from "antd"
import { List, ListSelect, TaskList } from "iconoir-react"
import type { MenuClickEventHandler } from "rc-menu/lib/interface"
import { useNavigate } from "react-router-dom"

type MenuItem = Required<MenuProps>["items"][number]
const items: MenuItem[] = [
  {
    key: "1",
    title: "All Todo",
    label: "All Todo",
    icon: <ListSelect />,
  },
  {
    key: "2",
    title: "Not Done",
    label: "Not Done",
    icon: <List />,
  },
  {
    key: "3",
    title: "Done",
    label: "Done",
    icon: <TaskList />,
  },
]

const TodoMenu = () => {
  const navigate = useNavigate()
  const handleClick: MenuClickEventHandler = ({ key }) => {
    const filter = key === "1" ? "all" : key === "2" ? "not-done" : "done"
    navigate("/todo?filter=" + filter)
  }
  return <Menu mode="inline" onClick={handleClick} items={items} />
}

export default TodoMenu
