"use client";
import CreateMockInterviewModal from "./components/CreateMockInterviewModal";
import { PlusOutlined } from "@ant-design/icons";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { Button, message, Space, Typography } from "antd";
import React, { useRef, useState } from "react";
import "./index.css";
import {listMockInterviewByPageUsingPost, listMockInterviewVoByPageUsingPost} from "@/api/mockInterviewController";
import { useRouter } from "next/navigation";

/**
 * 模拟面试管理页面
 *
 * @constructor
 */
const MockInterviewPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  // 当前题库点击的数据
  const [currentRow, setCurrentRow] = useState<API.MockInterview>();

  const router = useRouter();

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.MockInterview>[] = [
    {
      title: "id",
      dataIndex: "id",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "职位",
      dataIndex: "jobPosition",
      valueType: "text",
    },
    {
      title: "工作年限",
      dataIndex: "workExperience",
      valueType: "text",
    },
    {
      title: "难度",
      dataIndex: "difficulty",
      valueType: "text",
    },
    {
      title: "信息",
      dataIndex: "messages",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      valueType: "text",
      hideInForm: true,
    },
    {
      title: "创建时间",
      sorter: true,
      dataIndex: "createTime",
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              router.push("/mockinterview/chat/" + record.id);
            }}
          >
            查看面试
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.MockInterview>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建面试
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listMockInterviewVoByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.MockInterviewAddRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />
      <CreateMockInterviewModal
        visible={createModalVisible}
        columns={columns}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
    </PageContainer>
  );
};
export default MockInterviewPage;
