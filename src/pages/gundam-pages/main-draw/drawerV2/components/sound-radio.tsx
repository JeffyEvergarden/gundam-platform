import Condition from '@/components/Condition';
import { Checkbox, Form, InputNumber, Radio } from 'antd';
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
    if (item.userInputType == '10') {
      item.functionKeyStart = undefined;
      item.functionKeyWell = undefined;
      item.buttonInputSize = undefined;
    }

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

  const checkChange = (e: any, fi: any) => {
    const item = getItem();
    item[fi] = e.target.checked ? 1 : 0;

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
    if (isArray) {
      _formName.forEach((key: any, index: number) => {
        if (index === 0) {
          item = form.getFieldValue(key);
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
            <Form.Item style={{ marginLeft: '8px' }}>#号确认</Form.Item>
          </div>
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
              />
            </Form.Item>
          </div>
        </div>
      </Condition>
    </div>
  );
};

export default SoundRadio;
