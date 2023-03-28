import Condition from '@/components/Condition';
import Tip from '@/components/Tip';
import { Form, Radio, Select, Space } from 'antd';
import { useEffect } from 'react';

const CvsForm: React.FC<any> = (props: any) => {
  const {
    name = '',
    filedkey = '',
    fn = false,
    canEdit = false,
    reSound = false,
    form,
    formName,
  } = props;
  const { Option } = Select;

  useEffect(() => {
    console.log(name);
    console.log(form?.getFieldsValue()?.[formName?.[0]]?.[formName?.[1]]);
  }, []);

  const onChange = (val: any) => {
    console.log(val);

    if (val != -1) {
      let formData = form?.getFieldsValue();
      let item = formData?.[formName?.[0]]?.[formName?.[1]];
      console.log(formData, item);

      item.functionKeyStart = 0;
      item.functionKeyWell = 0;
      item.buttonInputSize = 1;
      form.setFieldsValue({ ...formData });
    }
  };

  return (
    <div>
      <Space align="baseline">
        <Form.Item
          name={fn ? name : name ? [...name, 'allowInterrupt'] : 'allowInterrupt'}
          key={fn ? filedkey : filedkey ? filedkey + 'allowInterrupt' : 'allowInterrupt'}
          initialValue={1}
          // style={{ marginLeft: '16px' }}
          label={'允许打断'}
        >
          <Radio.Group disabled={canEdit}>
            <Radio value={1} key={'1'}>
              是
            </Radio>
            <Radio value={0} key={'0'}>
              否
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Tip
          title={
            '用于控制语音平台在放音过程中是否允许打断，若是，播音过程检测到客户说话，则停止播报进行收音。'
          }
        />
        <Condition r-if={reSound}>
          <Form.Item
            name={fn ? name : name ? [...name, 'repeatHearKey'] : 'repeatHearKey'}
            key={fn ? filedkey : filedkey ? [...filedkey, 'repeatHearKey'] : 'repeatHearKey'}
            initialValue={'-1'}
            label={'是否重听'}
          >
            <Select
              size="small"
              style={{ width: '120px' }}
              disabled={
                canEdit ||
                form?.getFieldsValue()?.[formName?.[0]]?.[formName?.[1]]?.userInputType == '10'
              }
              onChange={onChange}
            >
              <Option value={'-1'} key={'-1'}>
                无重听按键
              </Option>
              <Option value={'1'} key={'1'}>
                按键1
              </Option>
              <Option value={'2'} key={'2'}>
                按键2
              </Option>
              <Option value={'3'} key={'3'}>
                按键3
              </Option>
              <Option value={'4'} key={'4'}>
                按键4
              </Option>
              <Option value={'5'} key={'5'}>
                按键5
              </Option>
              <Option value={'6'} key={'6'}>
                按键6
              </Option>
              <Option value={'7'} key={'7'}>
                按键7
              </Option>
              <Option value={'8'} key={'8'}>
                按键8
              </Option>
              <Option value={'9'} key={'9'}>
                按键9
              </Option>
              <Option value={'0'} key={'0'}>
                按键0
              </Option>
              <Option value={'*'} key={'*'}>
                按键*
              </Option>
            </Select>
          </Form.Item>{' '}
        </Condition>
        {/* <Tip title={''} /> */}
      </Space>
    </div>
  );
};

export default CvsForm;
