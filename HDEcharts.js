const getHDEcharts = (el, opt) => {
  return echarts.init(el, null, {
    devicePixelRatio: 8
    ...opt
  })
}
