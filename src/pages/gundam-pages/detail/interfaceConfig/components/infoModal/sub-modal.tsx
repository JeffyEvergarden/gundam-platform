import ProTable from '@ant-design/pro-table';
import { Button, Divider, Form, Input, Modal, Radio, Select, InputNumber } from 'antd';
import React, { useImperativeHandle, useState } from 'react';
import { useModel } from 'umi';
import FormList from '../formList/sub-index';
import style from './style.less';
import { useInterfaceModel } from '../../model';
import Moment from 'moment';
const { Item: FormItem } = Form;
const { Option } = Select;
const { TextArea } = Input;

const extra = {
  autoComplete: 'off',
};

const SubTestModal: React.FC<any> = (props: any) => {
  const { cref, confirm } = props;

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const [form] = Form.useForm();

  const [visible, setVisible] = useState<boolean>(false);

  const [result, setResult] = useState<any>(undefined);

  // const [loading, setLoading] = useState<boolean>(false);
  const [originInfo, setOriginInfo] = useState<any>({});

  const { postTestInterface, btLoading2 } = useInterfaceModel();

  const submit = async () => {
    const values = await form.validateFields();
    let res: any = await postTestInterface({
      ...originInfo,
      testRequestParamList:
        values?.testRequestParamList?.map((item: any) => {
          let val: any = item.paramValue;
          if (val instanceof Moment) {
            //时间格式
            val =
              item.dataType === 2
                ? (val as any).format?.('YYYY-MM-DD')
                : (val as any).format?.('YYYY-MM-DD HH:mm:ss');
          } else if (item.dataType === 4) {
            //
            val = val === 'true';
          }

          return {
            paramKey: item.paramKey,
            paramValue: val,
          };
        }) || [],
    });
    if (res) {
      setResult(JSON.stringify(res, null, 4));
    }
  };

  useImperativeHandle(cref, () => ({
    open: (row: any) => {
      setOriginInfo(row);

      let list = row.requestParamList || [];

      list = list.filter((item: any) => {
        return item.paramValueType !== 1;
      });
      form.setFieldsValue({
        testRequestParamList: list || [],
      });
      setVisible(true);
    },
    close: () => {
      setResult(undefined);
      setVisible(false);
    },
    submit,
  }));

  return (
    <>
      <Modal
        width={680}
        title={'接口测试'}
        visible={visible}
        onCancel={() => setVisible(false)}
        // okText={null}
        // onOk={submit}
        // confirmLoading={loading}
        footer={
          <div className={style['zy-row']}>
            <span style={{ flex: 1 }}></span>

            <Button key="back" onClick={() => setVisible(false)}>
              取消
            </Button>

            <Button
              type="primary"
              loading={btLoading2}
              onClick={() => {
                submit();
              }}
            >
              发送请求
            </Button>
          </div>
        }
      >
        <div className={style['modal_bg']} style={{ paddingLeft: '12px' }}>
          <Form form={form} style={{ width: '640px' }}>
            {/* 接口名称 */}

            <FormList form={form} />

            {/* 请求参数 */}
          </Form>

          <Divider orientation="left">查询结果</Divider>

          <div className={style['result']}>{result || '--'}</div>
        </div>
      </Modal>
    </>
  );
};

export default SubTestModal;
