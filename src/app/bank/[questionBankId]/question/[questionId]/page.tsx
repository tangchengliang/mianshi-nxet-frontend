"use client"
import React, { useEffect, useState } from "react";
import { Flex, Menu, message } from "antd";
import { getQuestionBankVoByIdUsingGet } from "@/api/questionBankController";
import { getQuestionVoByIdUsingGet } from "@/api/questionController";
import Title from "antd/es/typography/Title";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import QuestionCard from "@/components/QuestionCard";
import Link from "next/link";
import "./index.css";

/**
 * 题库题目详情页
 * @constructor
 */
export default function BankQuestionPage({ params }) {
  const { questionBankId, questionId } = params;
  const [bank, setBank] = useState(null);
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let didCancel = false;

    const fetchBank = async () => {
      try {
        const res = await getQuestionBankVoByIdUsingGet({
          id: questionBankId,
          needQueryQuestionList: true,
          pageSize: 200,
        });
        if (!didCancel) {
          setBank(res.data);
        }
      } catch (e) {
        if (!didCancel) {
          setError("获取题库列表失败，" + e.message);
        }
      }
    };

    const fetchQuestion = async () => {
      try {
        const res = await getQuestionVoByIdUsingGet({
          id: questionId,
        });
        if (!didCancel) {
          setQuestion(res.data);
        }
      } catch (e) {
        if (!didCancel) {
          setError("获取题目详情失败，" + e.message);
        }
      }
    };

    fetchBank();
    fetchQuestion();

    // 清理函数，防止在组件卸载或选项更改后设置状态
    return () => {
      didCancel = true;
    };
  }, [questionBankId, questionId]); // 依赖这些参数来重新获取数据

  useEffect(() => {
    setLoading(false); // 数据加载完成后设置加载状态为false
  }, [bank, question]); // 依赖bank和question状态

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!bank || !question) {
    return <div>获取数据失败，请刷新重试</div>;
  }

  // 题目菜单列表
  const questionMenuItemList = (bank.questionPage?.records || []).map((q) => ({
    label: (
      <Link href={`/bank/${questionBankId}/question/${q.id}`}>{q.title}</Link>
    ),
    key: q.id,
  }));

  return (
    <div id="bankQuestionPage">
      <Flex gap={24}>
        <Sider width={240} theme="light" style={{ padding: "24px 0" }}>
          <Title level={4} style={{ padding: "0 20px" }}>
            {bank.title}
          </Title>
          <Menu items={questionMenuItemList} selectedKeys={[question.id]} />
        </Sider>
        <Content>
          <QuestionCard question={question} />
        </Content>
      </Flex>
    </div>
  );
}
