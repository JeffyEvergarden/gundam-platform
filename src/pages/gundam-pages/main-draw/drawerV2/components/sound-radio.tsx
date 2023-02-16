import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import { Checkbox, Form, InputNumber, Radio, Space } from 'antd';
import { useCallback, useState } from 'react';
import styles from './style.less';

const SoundRadio: React.FC<any> = (props: any) => {
  const { form, name, index, disabled = false, field, formName: _formName } = props;
  // let formData = form.getFieldsValue()?.[name]?.responseList[index];
  const [num, setNum] = useState<number>(1);

  const update = useCallback(() => {
    setNum(num + 1);
  }, [num]);

  const isArray = Array.isArray(_formName); // 数组
  const key = isArray ? _formName[0] : _formName; // 首字段

  const change = (val: any) => {
    const item = getItem();
    console.log(item);

    if (item.userInputType == '10') {
      item.functionKeyStart = undefined;
      item.functionKeyWell = undefined;
      item.buttonInputSize = undefined;
      item.repeatHearKey = -1; //语音不给选重听
    }

    if (item.userInputType == '01') {
      item.functionKeyStart = 1;
      item.functionKeyWell = 1;
      item.buttonInputSize = 10;
    }

    const list = form?.getFieldValue(key);
    if (isArray && list instanceof Array) {
      form.setFieldsValue({
        [key]: [...list],
      });
    } else {
      form.setFieldsValue({
        [key]: {
          ...item,
        },
      });
      update();
    }
  };

  const checkChange = (e: any, fi?: any) => {
    const item = getItem();
    if (fi) {
      item[fi] = e.target.checked ? 1 : 0;
    }

    item['repeatHearKey'] = -1;
    const list = form.getFieldValue(key);
    if (isArray && list instanceof Array) {
      form.setFieldsValue({
        [key]: [...list],
      });
    } else {
      form.setFieldsValue({
        [key]: {
          ...item,
        },
      });
      update();
    }
  };

  const getItem = () => {
    let item: any = form?.getFieldsValue?.() || {};
    console.log(item);

    if (isArray) {
      _formName.forEach((key: any, index: number) => {
        if (index === 0) {
          item = form?.getFieldValue(key);
        } else {
          item = item?.[key] || {};
        }
      });
      // 获取到对象
    } else {
      item = form.getFieldValue(_formName);
    }
    return item;
  };
  return (
    <div className={styles['functionkey']}>
      <Space align="baseline">
        <Form.Item
          name={[field.name, 'userInputType']}
          fieldKey={[field.fieldKey, 'userInputType']}
          initialValue={'10'}
          label={'输入方式'}
        >
          <Radio.Group onChange={change} disabled={disabled}>
            <Radio value={'10'}>语音</Radio>
            <Radio value={'01'}>按键</Radio>
          </Radio.Group>
        </Form.Item>

        <Condition r-if={getItem()?.userInputType == '01'}>
          <div className={styles['functionkey']}>
            <div className={styles['functionkey']} style={{ marginRight: '16px' }}>
              <Form.Item
                name={[field.name, 'functionKeyWell']}
                fieldKey={[field.fieldKey, 'functionKeyWell']}
                initialValue={1}
                valuePropName="checked"
              >
                <Checkbox
                  disabled={disabled}
                  onChange={(e) => {
                    checkChange(e, 'functionKeyWell');
                  }}
                ></Checkbox>
              </Form.Item>
              <Form.Item style={{ marginLeft: '8px' }}>#号确认</Form.Item>
            </div>
            <div className={styles['functionkey']} style={{ marginRight: '16px' }}>
              <Form.Item
                name={[field.name, 'functionKeyStart']}
                fieldKey={[field.fieldKey, 'functionKeyStart']}
                initialValue={1}
                valuePropName="checked"
              >
                <Checkbox
                  disabled={disabled}
                  onChange={(e) => {
                    checkChange(e, 'functionKeyStart');
                  }}
                ></Checkbox>
              </Form.Item>
              <Form.Item style={{ marginLeft: '8px' }}>*号取消</Form.Item>
            </div>

            <div className={styles['functionkey']}>
              <Form.Item>按键长度：</Form.Item>
              <Form.Item
                name={[field.name, 'buttonInputSize']}
                fieldKey={[field.fieldKey, 'buttonInputSize']}
                initialValue={10}
                rules={[{ required: true, message: '请输入按键长度' }]}
              >
                <InputNumber
                  max={40}
                  min={1}
                  step="1"
                  precision={0}
                  style={{ width: '161px' }}
                  placeholder="请输入按键长度"
                  disabled={disabled}
                  onChange={(e) => {
                    checkChange(e);
                  }}
                />
              </Form.Item>
            </div>
          </div>
        </Condition>

        <Tip
          title={
            '用于控制此话术播放后，语音平台选择何种方式收集客户输入；可配置*和#作为功能键，配置按键输入长度（按键输入达到长度自动发送）。'
          }
        />
      </Space>
    </div>
  );
};

export default SoundRadio;
