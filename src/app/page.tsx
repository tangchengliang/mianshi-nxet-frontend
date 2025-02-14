import "./index.css";
import {listQuestionBankVoByPageUsingPost} from "@/api/questionBankController";

/**
 * 主页
 * @constructor
 */
export default function HomePage() {
  listQuestionBankVoByPageUsingPost({}).then((res) => {
    console.log(res);
  });

  return <div id="homePage">主页</div>;
}
