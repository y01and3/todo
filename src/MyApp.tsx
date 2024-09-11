import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout, Spin, theme, Typography } from "antd"
import { Header, Content, Footer } from "antd/es/layout/layout"
import Sider from "antd/es/layout/Sider"
import AddTodoButton from "./components/todo/AddTodoButton"

const AddTodo = React.lazy(() => import("./page/AddTodo"))
const EditTodo = React.lazy(() => import("./page/EditTodo"))
const TodoDetail = React.lazy(() => import("./page/TodoDetail"))
const Home = React.lazy(() => import("./page/Home"))
const Todo = React.lazy(() => import("./page/Todo"))
const TodoMenu = React.lazy(() => import("./components/todo/TodoMenu"))

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
              <Route
                path="/"
                element={
                  <React.Suspense
                    fallback={<Spin spinning percent="auto" fullscreen />}
                  >
                    <Home />
                  </React.Suspense>
                }
              />
              <Route
                path="/todo"
                element={
                  <React.Suspense
                    fallback={<Spin spinning percent="auto" fullscreen />}
                  >
                    {" "}
                    <Todo setTitle={setTitle} />
                  </React.Suspense>
                }
              />
              <Route
                path="/todo/add"
                element={
                  <React.Suspense
                    fallback={<Spin spinning percent="auto" fullscreen />}
                  >
                    <AddTodo setTitle={setTitle} />
                  </React.Suspense>
                }
              />
              <Route
                path="/todo/:id/edit"
                element={
                  <React.Suspense
                    fallback={<Spin spinning percent="auto" fullscreen />}
                  >
                    <EditTodo setTitle={setTitle} />
                  </React.Suspense>
                }
              />
              <Route
                path="/todo/:id"
                element={
                  <React.Suspense
                    fallback={<Spin spinning percent="auto" fullscreen />}
                  >
                    <TodoDetail setTitle={setTitle} />
                  </React.Suspense>
                }
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
