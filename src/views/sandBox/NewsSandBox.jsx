import React, { useEffect } from "react";
import SideMeu from "../../components/sandbox/SideMeu";
import TopHeader from "../../components/sandbox/TopHeader";
import NewsRouter from "../../components/sandbox/NewsRouter";
import NProgress from "accessible-nprogress";
// import 'nprogess/nprogess.css'
import "./NewsSandBox.css";
import { Layout } from "antd";
const { Content } = Layout;

export default function NewsSandBox() {
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  });
  // const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout>
      <SideMeu></SideMeu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <NewsRouter />
        </Content>
      </Layout>
    </Layout>
  );
}
