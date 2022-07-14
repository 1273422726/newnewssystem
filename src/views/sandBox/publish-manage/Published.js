import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button } from "antd";

export default function Published() {
  const { dataSource, handlePublished } = usePublish(2); //2 表示已发布
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button type="primary" onClick={() => handlePublished(id)}>
            下线
          </Button>
        )}
      ></NewsPublish>
    </div>
  );
}
