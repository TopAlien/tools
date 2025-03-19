// 少量元素选择svg渲染
const getHDEcharts = (el, opt) => {
  return echarts.init(el, null, {
    devicePixelRatio: 8
    ...opt
  })
}
