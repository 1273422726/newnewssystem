import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button } from "antd";

export default function Sunset() {
  const { dataSource, handleSunset } = usePublish(3); //3 表示已下线
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button danger onClick={() => handleSunset(id)}>
            删除
          </Button>
        )}
      ></NewsPublish>
    </div>
  );
}
