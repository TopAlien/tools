/// element-ui 自定义组件 自动触发校验

/// elementUiDispatch(this, 'ElFormItem', 'el.form.blur', [this.value]);
/// elementUiDispatch(this, 'ElFormItem', 'el.form.change', [this.value]);
// elementUiDispatch(this, 'ElFormItem', 'el.form.change');
export function elementUiDispatch(
  vueContext,
  componentName = 'ElFormItem',
  eventName = 'el.form.change',
  params
) {
  let parent = vueContext.$parent || vueContext.$root;
  let name = parent.$options.componentName;

  while (parent && (!name || name !== componentName)) {
    parent = parent.$parent;

    if (parent) {
      name = parent.$options.componentName;
    }
  }
  if (parent) {
    const args = [eventName].concat(params);
    parent.$emit.apply(parent, args);
  }
}
