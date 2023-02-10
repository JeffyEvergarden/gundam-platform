import { Button, DatePicker, Radio, Select, Space } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn'; //RangePicker月份中文
import { useEffect, useState } from 'react';
import { Access, useAccess, useModel } from 'umi';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

export default (props: any) => {
  const { choseTime, exportReportForm, exportSessionList, pageType, permission } = props;

  const { info } = useModel('gundam' as any, (model: any) => ({
    info: model.info,
  }));

  const access = useAccess();

  const { channelList, getChannelList } = useModel('drawer' as any, (model: any) => ({
    channelList: model.channelList,
    getChannelList: model.getChannelList,
  }));

  useEffect(() => {
    getChannelList(info.id);
  }, []);

  const [valRadio, setValue] = useState<string>('sevenDays');
  const [startTime, setStart] = useState<string>('');
  const [endTime, setEnd] = useState<string>('');
  const [keyValue, setKeyValue] = useState<any>(''); //给rangePicker控件添加key属性，点击重置时，修改key的值，如new Date()，相当于重新渲染控件，达到让控件重置的功能
  const [code, setCode] = useState<any>(['']);

  const changeTime = (e: any) => {
    let val = e.target.value;
    setValue(val);
    let begin = '';
    let end = '';
    let yestody = moment().subtract(1, 'days');
    end = yestody.format('YYYY-MM-DD');
    if (val === 'yestoday') {
      let yestody = moment().subtract(1, 'days');
      begin = yestody.format('YYYY-MM-DD');
    }
    if (val === 'today') {
      let today = moment().subtract(0, 'days');
      begin = today.format('YYYY-MM-DD');
      end = today.format('YYYY-MM-DD');
    }
    if (val === 'sevenDays') {
      let sevenDays = moment().subtract(6, 'days');
      begin = sevenDays.format('YYYY-MM-DD');
      let today = moment().subtract(0, 'days');
      end = today.format('YYYY-MM-DD');
    }
    if (val === 'month') {
      let month = moment().subtract(29, 'days');
      begin = month.format('YYYY-MM-DD');
      let today = moment().subtract(0, 'days');
      end = today.format('YYYY-MM-DD');
    }
    setStart(begin);
    setEnd(end);
    setKeyValue(new Date());
    choseTime(begin, end, code);
  };

  const rangeChange = (val: any) => {
    if (val && val.length) {
      let start = val[0].format('YYYY-MM-DD');
      let end = val[1].format('YYYY-MM-DD');
      setStart(start);
      setEnd(end);
      choseTime(start, end, code);
      setValue('');
    } else {
      setValue('sevenDays');
      choseTime('', '', code);
    }
  };

  const onSelect = (val: any) => {
    if (val !== '') {
      let temp = [...code];
      temp = temp.filter((item: any) => item !== '');
      temp.push(val);
      setCode(temp);
      choseTime(startTime, endTime, temp);
    } else if (val == '') {
      setCode(['']);
      choseTime(startTime, endTime, ['']);
    }
  };

  const onDeselect = (val: any) => {
    let temp = [...code];
    temp = temp.filter((item: any) => item !== val);
    setCode(temp);
    choseTime(startTime, endTime, temp);
  };

  const exportForm = () => {
    console.log(code);

    exportReportForm(startTime, endTime, code);
  };

  const exportSession = () => {
    console.log(code);

    exportSessionList(startTime, endTime, code);
  };

  const disabledDate = (current: any) => {
    return current && current > moment().subtract(0, 'days').endOf('day');
  };

  return (
    <div className={styles.headSearch}>
      <Space>
        <Radio.Group value={valRadio} onChange={changeTime}>
          <Radio.Button value="yestoday">昨天</Radio.Button>
          <Radio.Button value="today">今天</Radio.Button>
          <Radio.Button value="sevenDays">最近七天</Radio.Button>
          <Radio.Button value="month">最近一个月</Radio.Button>
        </Radio.Group>
        <RangePicker
          onChange={rangeChange}
          format={'YYYY-MM-DD'}
          disabledDate={disabledDate}
          key={keyValue}
        />
        <Select
          style={{ maxWidth: '400px', minWidth: '120px' }}
          onSelect={onSelect}
          onDeselect={onDeselect}
          mode="multiple"
          allowClear
          maxTagCount={3}
          value={code}
        >
          <Option key={''} value="">
            全部渠道
          </Option>
          {channelList.map((item: any) => {
            return (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      </Space>
      <Space>
        <Access accessible={access.accessAuth(permission)}>
          <Button type="primary" onClick={exportForm}>
            导出报表
          </Button>
        </Access>
        {pageType === 'visitorSession' && (
          <Button type="primary" onClick={exportSession}>
            导出会话明细
          </Button>
        )}
      </Space>
    </div>
  );
};
