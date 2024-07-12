import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AddTodo from "./page/AddTodo"
import EditTodo from "./page/EditTodo"
import TodoDetail from "./page/TodoDetail"
import Home from "./page/Home"
import Todo from "./page/Todo"
import TodoMenu from "./components/todo/TodoMenu"
import { Layout, theme, Typography } from "antd"
import { Header, Content, Footer } from "antd/es/layout/layout"
import Sider from "antd/es/layout/Sider"
import AddTodoButton from "./components/todo/AddTodoButton"

const MyApp = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken()
  const [title, setTitle] = React.useState("Todo List")

  return (
    <Router>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Typography.Title
            level={3}
            style={{
              margin: 0,
              padding: "16px",
              textTransform: "capitalize",
            }}
          >
            {title}
          </Typography.Title>
        </Header>
        <Layout>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => {
              console.log(broken)
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type)
            }}
            style={{ backgroundColor: colorBgContainer }}
          >
            <TodoMenu />
          </Sider>
          <Content style={{ margin: "24px 16px 0", minHeight: "80vh" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/todo" element={<Todo setTitle={setTitle} />} />
              <Route
                path="/todo/add"
                element={<AddTodo setTitle={setTitle} />}
              />
              <Route
                path="/todo/:id/edit"
                element={<EditTodo setTitle={setTitle} />}
              />
              <Route
                path="/todo/:id"
                element={<TodoDetail setTitle={setTitle} />}
              />
            </Routes>
            <AddTodoButton />
          </Content>
        </Layout>
        <Footer style={{ textAlign: "center" }}>
          Created by{" "}
          <Typography.Link href="https://github.com/y01and3" target="_blank">
            y01and3
          </Typography.Link>
        </Footer>
      </Layout>
    </Router>
  )
}

export default MyApp
