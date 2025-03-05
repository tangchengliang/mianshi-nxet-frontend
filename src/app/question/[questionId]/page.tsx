"use client"; // 标记为客户端组件
import { useEffect, useState } from "react";
import { message } from "antd";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import QuestionCard from "@/components/QuestionCard";
import "./index.css";

/**
 * 题目详情页
 * @constructor
 */
export default function QuestionPage({ params }) {
  const { questionId } = params;
  const [question, setQuestion] = useState(null); // 题目详情
  const [loading, setLoading] = useState(true); // 加载状态
  const [error, setError] = useState(null); // 错误状态

  // 获取题目详情
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await getQuestionVoByIdUsingGet({ id: questionId });
        setQuestion(res.data);
      } catch (e) {
        setError(e.message);
        message.error("获取题目详情失败，" + e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  // 错误处理
  if (error) {
    return <div>获取题目详情失败，请刷新重试</div>;
  }

  // 加载状态
  if (loading) {
    return <div>加载中...</div>;
  }

  // 题目不存在
  if (!question) {
    return <div>题目不存在</div>;
  }

  return (
      <div id="questionPage" className="max-width-content">
        <QuestionCard question={question} />
      </div>
  );
}