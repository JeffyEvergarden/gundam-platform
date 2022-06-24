import { Spin } from 'antd';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import styles from './index.less';

const PieCharts: React.FC<any> = (props: any) => {
  let {
    base = 1,
    id,
    data = [],
    loading = false,
    className,
    title,
    color,
    legendData,
    columns,
    sumReplyNum,
    dataSource,
  } = props;

  let first = false;

  const lineChart = useRef<any>(null);

  useEffect(() => {
    const chartDom = document.getElementById(`linebox-${id}`);
    lineChart.current = echarts.init(chartDom as any);
    initChart();
    first = true;
  }, []);

  useEffect(() => {
    if (!first) {
      initChart();
      lineChart.current?.resize?.();
    }
  }, [base, data]);

  const initChart = () => {
    const options: any = initOptions(data);
    lineChart.current.setOption(options);
  };

  const initOptions = (data: any) => {
    let Title;
    if (dataSource.length && dataSource.length > 0) {
      Title = {
        show: title ? true : false,
        left: 0,
        top: 0,
        text: title,
        textStyle: {
          color: 'rgba(0, 0, 0, 0.85)',
          fontSize: 16 * base,
          lineHeight: 16,
          fontWeight: '400',
        },
      };
    } else {
      Title = {
        show: true,
        left: 'center',
        top: 'center',
        text: '暂无数据',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.85)',
          fontSize: 16 * base,
          lineHeight: 16,
          fontWeight: '400',
        },
      };
    }
    return Object.assign(
      {},
      {
        color: color,
        textStyle: {
          fontFamily: 'PingFang SC, sans-serif, Microsoft YaHei, SimHei',
        },
        title: Title,
        legend: {
          bottom: -5 * base,
          left: 58 * base,
          data: legendData,
          icon: 'circle',
          textStyle: {
            fontSize: 12 * base,
            lineHeight: 16 * base,
          },
        },
        grid: {
          top: '5%',
          left: '5%',
          bottom: '5%',
          right: '5%',
          containLabel: true,
        },
        tooltip: {
          trigger: 'item',
          formatter: formateTooltip,
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['55%', '70%'],
            avoidLabelOverlap: false,
            center: ['50%', '50%'],
            label: {
              show: dataSource.length && dataSource.length > 0 ? true : false,
              position: 'center',
              fontSize: '24',
              formatter: ['回答总数', `${sumReplyNum}`].join('\n'),
            },
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      },
    );
  };
  const formateTooltip = (params: any) => {
    return `
    <div class='${styles['tooltips-box_pie']}'>
      <div class="${styles.icon}" style="background: ${params.color}"></div>
      <div class="${styles.val}">${params.name}</div>
      <div class="${styles.val}">${params.value}</div>
      <div class="${styles.val}">${params.data.percent}</div>
    </div>

    `;
  };

  return (
    <div className={styles.linebox}>
      <Spin spinning={loading}>
        <div
          id={`linebox-${id}`}
          style={{ height: `${378 * base}px`, width: '100%' }}
          className={styles['line-box']}
        />
      </Spin>
    </div>
  );
};

export default PieCharts;
