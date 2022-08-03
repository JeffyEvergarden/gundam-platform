// import ProTable from '@ant-design/pro-table';
// import { Button, Popconfirm } from 'antd';
// import React, { useRef } from 'react';
// import { useModel } from 'umi';
// import { useLabelModel } from './model';
// import style from './style.less';

// // 话术标签列表
// const DetailPages: React.FC = (props: any) => {
//   const { labelList, getLabelTableList, labelLoading } = useLabelModel();
//   const TableRef = useRef<any>({});
//   const ModalRef = useRef<any>({});

//   const { info, setInfo } = useModel('gundam' as any, (model: any) => ({
//     info: model.info,
//     setInfo: model.setInfo,
//   }));

//   const columns: any[] = [
//     {
//       title: '标签名称',
//       dataIndex: 'actionLabel',
//       fixed: 'left',
//       fieldProps: {
//         placeholder: '请输入标签名称',
//       },
//       ellipsis: true,
//       width: 180,
//     },
//     {
//       title: '描述',
//       dataIndex: 'labelDesc',
//       search: false,
//       width: 200,
//       ellipsis: true,
//       render: (val: any, row: any) => {
//         return val;
//       },
//     },
//     {
//       title: '创建者',
//       dataIndex: 'creator',
//       search: false,
//       width: 200,
//     },
//     {
//       title: '创建时间',
//       dataIndex: 'createTime',
//       search: false,
//       width: 200,
//     },
//     {
//       title: '操作',
//       dataIndex: 'op',
//       search: false,
//       fixed: 'right',
//       width: 130,
//       render: (val: any, row: any, index: number) => {
//         return (
//           <div>
//             <div style={{ display: 'flex' }}>
//               {/* <Button // 标签无法编辑
//                 type="link"
//                 onClick={() => {
//                   labelModalRef.current?.open?.(row);
//                 }}
//               >
//                 编辑
//               </Button> */}

//               <Popconfirm
//                 title="删除将不可恢复，确认删除？"
//                 okText="确定"
//                 cancelText="取消"
//                 onConfirm={() => {
//                   deleteRow(row);
//                 }}
//               >
//                 <Button type="link" danger>
//                   删除
//                 </Button>
//               </Popconfirm>
//             </div>
//           </div>
//         );
//       },
//     },
//   ];

//   return (
//     <div className={`${style['machine-page']} list-page`}>
//       <ProTable<any>
//         columns={columns}
//         actionRef={TableRef}
//         scroll={{ x: columns.length * 200 }}
//         request={async (params = {}, sort, filter) => {
//           return getLabelTableList({
//             robotId: info.id,
//             page: params.current,
//             ...params,
//           });
//         }}
//         editable={{
//           type: 'multiple',
//         }}
//         columnsState={{
//           persistenceKey: 'pro-table-machine-list',
//           persistenceType: 'localStorage',
//         }}
//         rowKey="index"
//         search={{
//           labelWidth: 'auto',
//         }}
//         form={{
//           syncToUrl: (values, type) => {
//             if (type === 'get') {
//               return {
//                 ...values,
//               };
//             }
//             return values;
//           },
//         }}
//         pagination={{
//           pageSize: 10,
//         }}
//         dateFormatter="string"
//         headerTitle="话术标签列表"
//         toolBarRender={() => [
//           <Button
//             key="button"
//             type="primary"
//             onClick={() => {
//               ModalRef.current?.open?.();
//             }}
//           >
//             新建评估样本集
//           </Button>,
//         ]}
//       />
//     </div>
//   );
// };

// export default DetailPages;
