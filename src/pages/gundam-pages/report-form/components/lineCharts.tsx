import { useState, useEffect, useRef } from 'react';
import { Spin } from 'antd';
import * as echarts from 'echarts';
import { formatePercent, formateNumer } from '@/utils';
import styles from './index.less';

const LineChartPage: React.FC<any> = (props: any) => {
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
  } = props;

  base = isNaN(base) ? 1 : base;

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

  // 生成图表数据
  const initChart = () => {
    // const columns: any = ['2021-03-04', '2021-05-04', '2021-06-04', '2021-08-04'];
    // const data1: any = [10, 20, 30];
    // const data2: any = [15, 25, 35];
    // const data3: any = [55, 45, 35];
    // data.forEach((item: any) => {
    //   columns.push(item.name);
    //   data1.push(item.value1);
    //   data2.push(item.value2);
    //   data3.push(item.value3);
    // });
    // if (!data1.length || !data2.length) {
    //   return;
    // }
    let temp: any = [];
    data?.map((item: any) => {
      temp.push({
        name: item.name,
        data: item.val,
        type: 'line',
        yAxisIndex: 0,
        z: 5,
        showSymbol: false,
        lineStyle: {
          width: 2 * base,
        },
        emphasis: {
          focus: 'series',
        },
        label: {
          fontSize: 12 * base,
        },
        labelLayout: {
          moveOverlap: 'shiftY',
        },
      });
    });
    const options: any = initOptions(columns, temp);
    lineChart.current.setOption(options);
  };

  const initOptions = (columns: any[], data: any[]) => {
    return Object.assign(
      {},
      {
        color: color,
        textStyle: {
          fontFamily: 'PingFang SC, sans-serif, Microsoft YaHei, SimHei',
        },
        title: {
          show: false,
          top: 0,
          left: 180 * base,
          text: title,
          textStyle: {
            color: 'rgba(0, 0, 0, 0.85)',
            fontSize: 14 * base,
            lineHeight: 16,
            fontWeight: 'bold',
          },
        },
        legend: {
          bottom: -8 * base,
          left: 350 * base,
          data: legendData,
          textStyle: {
            fontSize: 12 * base,
            lineHeight: 16,
          },
        },
        grid: [
          {
            top: 40 * base,
            left: 45 * base,
            right: 50 * base,
            bottom: 60 * base,
          },
          {
            height: 20 * base,
            bottom: 0 * base,
          },
        ],
        tooltip: {
          trigger: 'axis',
          formatter: formateTooltip,
          position: getTooltipsPosition,
        },
        xAxis: {
          type: 'category',
          data: columns,
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: '#e9e9e9',
            },
          },
          axisLabel: {
            color: 'rgba(0, 0, 0, 0.65)',
            // showMaxLabel: true,
          },
        },
        yAxis: [
          {
            name: ``,
            type: 'value',
            // max: max2,
            splitNumber: 6,
            nameTextStyle: {
              fontSize: 12 * base,
              padding: [0, 12 * base, 0, 0],
            },
            splitLine: {
              show: true,
            },
            axisLabel: {
              formatter: (val: any) => {
                return val;
              },
            },
          },
          {
            name: ``,
            type: 'value',
            max: 1,
            splitNumber: 6,
            nameTextStyle: {
              fontSize: 12 * base,
              padding: [0, 0, 0, 8 * base],
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                color: 'rgba(0,0,0,0.07)',
              },
            },
            axisLabel: {
              formatter: (val: any) => {
                if (id === 'visitorNumber') {
                  return null;
                } else {
                  return val * 100 + '%';
                }
              },
            },
          },
        ],
        series: data,
      },
    );
  };

  const formateTooltip = (params: any) => {
    const arr = params || [];
    // console.log(arr[0])
    const titleStr = arr?.[0]?.name || '';
    let arrStr = '';
    arr.forEach((item: any, index: number) => {
      let label = item.seriesName;
      let value = item.value;

      arrStr += `
      <div class='${styles['tooltips-item']}'>
        <div class="${styles.icon}" style="background: ${item.color}"></div>
        <div class="${styles.label}">${label}</div>
        <div class="${styles.value}">${value}</div>
      </div>`;
    });
    return `
      <div class='${styles['tooltips-box']}'>
        <div class='${styles['tooltips-item']}'>
          ${titleStr}
        </div>
        ${arrStr}
      </div>
    `;
  };

  const getTooltipsPosition = (pos: any, params: any, dom: any, rect: any, size: any) => {
    // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
    const [x, y] = pos;
    const [cx, cy] = size.contentSize;
    let xz = x < size.viewSize[0] / 2 ? 10 : -10 - cx;
    let yz = y < size.viewSize[1] / 2 ? 10 : -10 - cy;
    return {
      top: y + yz,
      left: x + xz,
    };
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

export default LineChartPage;
