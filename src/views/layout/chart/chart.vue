<template>
  <div class="chart">
    <el-card>
      <div class="card">
        <div class="item">
          <div class="top">{{ info.increment_users }}</div>
          <p class="txt">今日新增用户</p>
        </div>
        <div class="item">
          <div class="top">{{ info.total_users }}</div>
          <p class="txt">总用户量</p>
        </div>
        <div class="item">
          <div class="top">{{ info.increment_questions }}</div>
          <p class="txt">新增试题</p>
        </div>
        <div class="item">
          <div class="top">{{ info.total_questions }}</div>
          <p class="txt">总试题量</p>
        </div>
        <div class="item">
          <div class="top">{{ info.total_done_questions }}</div>
          <p class="txt">总刷题量</p>
        </div>
        <div class="item">
          <div class="top">{{ info.personal_questions }}</div>
          <p class="txt">人均刷题量</p>
        </div>
      </div>
    </el-card>
    <el-card>
      <div ref="echarts" class="echarts"></div>
    </el-card>
  </div>
  <!--echarts基本使用
  1：安装cnpm  i echarts
  2:导入 import echarts from 'echarts'
  3:初始化echarts myecahrts= echarts.init(选择dom)
  4:复制配制 option={写配制}
  5:myecahrts.setOption(option) 
    -->
</template>

<script>
import { getChartList, getChartStatistics } from '@/api/chart.js'
import echarts from 'echarts'
export default {
  data () {
    return {
      info: '',
      myecharts: '',
      list: [],
      num: 0,
      interTime: ''
    }
  },
  created () {
    getChartList().then(res => {
      this.info = res.data
      window.console.log('数据：', res)
    })
    getChartStatistics().then(res => {
      this.list = res.data
      let nameArr = res.data.map(item => {
        return item.name
      })
      window.console.log('图表数据', res)
      this.myecharts = echarts.init(this.$refs.echarts)
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          data: nameArr
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.list
          }
        ]
      }
      this.myecharts.setOption(option)
    })
  },
  mounted () {
    this.interTime = setInterval(() => {
      this.num++
      window.console.log(this.num)
    }, 1000)
    window.addEventListener('scroll', this.scrollEvent)
  },
  methods: {
    scrollEvent () {
      window.console.log('scroll')
    }
  },
  beforeDestroy () {
    clearInterval(this.interTime)
    window.removeEventListener('scroll', this.scrollEvent)
  },
  destroyed () {
    //dom与data之间无任何关系
  }
}
</script>

<style lang="less">
.chart {
  .card {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .item {
      .top {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 2px solid rgba(0, 134, 250, 1);
        text-align: center;
        line-height: 100px;
        color: rgba(0, 134, 250, 1);
      }
      .txt {
        text-align: center;
      }
    }
  }
  .echarts {
    height: 450px;
  }
}
</style>
