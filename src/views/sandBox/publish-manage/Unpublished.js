import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";
import { Button } from "antd";

export default function Unpublished() {
  const { dataSource, handleUnpublished } = usePublish(1); //1 表示待发布
  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        button={(id) => (
          <Button type="primary" onClick={() => handleUnpublished(id)}>
            发布
          </Button>
        )}
      ></NewsPublish>
    </div>
  );
}
