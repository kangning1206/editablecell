<!--
 * @Author: ningbo.kang
 * @Date: 2019-07-02 14:47:20
 * @LastEditors: ningbo.kang
 * @LastEditTime: 2019-07-04 09:25:52
 * @Description: 表格行内编辑组件
 -->
<template>
  <div class="editable-cell">
    <div v-if="editable" :class="['editable-cell-input-wrapper',singleEdit ? 'single-edit' : '']">
      <a-form :form="form">
        <a-form-item :colon="false" class="no-validate">
          <a-input v-if="showFormItem('input')" v-decorator="decorator" :placeholder="placeholder" @change="handleChange" />
          <a-input-number :min="min" :max="max" v-if="showFormItem('number')" v-decorator="decorator" :placeholder="placeholder" />
          <a-switch v-if="showFormItem('switch')" v-decorator="decorator" :placeholder="placeholder" @change="handleChange" />
          <a-date-picker :showTime="showTime" :format="format" v-if="showFormItem('datePicker')" v-decorator="decorator" :placeholder="placeholder" />
          <a-range-picker :showTime="showTime" :format="format" v-if="showFormItem('rangePicker')" v-decorator="decorator" :placeholder="placeholder" />

          <a-select v-if="showFormItem('select')" v-decorator="decorator" :placeholder="placeholder" @change="handleChange">
            <slot/>
          </a-select>

        </a-form-item>
      </a-form>
      <a-icon v-if="singleEdit" type="check" class="editable-cell-icon-check" @click="check(true)" />
    </div>
    <div v-else :class="['editable-cell-text-wrapper',singleEdit ? 'single-edit' : '']">
      {{ getText || ' ' }}
      <a-icon v-if="singleEdit" type="edit" class="editable-cell-icon" @click="edit" />
    </div>
  </div>
</template>
<script>
// https://github.com/yiminghe/async-validator#type

export default {
  data() {
    return {
      form: this.$form.createForm(this),
      editable: this.defaultEditable,
    };
  },
  props: {
    // 非编辑模式下，显示文本
    text: {
      type: [Number, String, Function],
    },
    // 编辑模式下组件值
    value: {
      message: { type: [Number, String, Array, Object], default: '' },
    },
    // 表单组件类型
    formType: {
      validator(value) {
        return ['input', 'number', 'switch', 'datePicker', 'rangePicker', 'select'].indexOf(value) !== -1;
      },
      default: 'input',
    },
    // 是否必须输入
    required: { type: Boolean, default: false },
    // 错误提醒
    message: { type: String, default: '' },
    // 默认编辑模式
    defaultEditable: { type: Boolean, default: false },
    // 站位符号
    placeholder: { type: String, default: '请输入' },
    min: { type: Number, default: -Infinity },
    max: { type: Number, default: Infinity },
    decoratorType: { type: String, default: '' },
    showTime: { type: [Boolean, Object], default: false },
    format: { type: String, default: 'YYYY-MM-DD' },
    singleEdit: { type: Boolean, default: false },
  },
  computed: {
    // 格式化文本
    getText() {
      if (typeof this.text === 'function') {
        return this.text();
      }
      return this.text;
    },
    // 根据属性，合成表单验证装饰器
    decorator() {
      const option = { rules: [{ required: this.required, message: this.message }], initialValue: this.value };
      const [firstRule] = option.rules;
      const itemDecorator = ['formName'];
      if (this.decoratorType) {
        firstRule.type = this.decoratorType;
      }
      switch (this.formType) {
        case 'input':
          firstRule.whitespace = true;
          break;
        case 'number':
          break;
        case 'switch':
          option.valuePropName = 'checked';
          break;
        case 'datePicker':
          firstRule.type = 'object';
          break;
        case 'rangePicker':
          firstRule.type = 'array';
          break;
        default:
          break;
      }
      itemDecorator.push(option);
      return itemDecorator;
    },
  },
  watch: {
    // 监视父页面是否可编辑属性，及时响应控件内切换
    defaultEditable(value) {
      this.editable = value;
    },
  },
  methods: {
    // 判断表单是否
    showFormItem(formType) {
      return this.formType === formType;
    },
    handleChange(value) {
      // if (this.formType === 'input') {
      //   this.$emit('change', value.target.value);
      // }
      // this.check(false);
    },
    validate() {
      let result = {
        success: false,
        value: '',
      };
      this.form.validateFields((err, values) => {
        if (!err) {
          result.success = true;
          result.value = values.formName;
        }
      });
      return result;
    },
    // 点击"对号"图标，校验通过后触发通知父组件
    check(flag) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (flag) {
            // 切换到只读模式
            this.editable = false;
          }
          this.$emit('change', values.formName);
        }
      });
    },
    // 切换到编辑模式
    edit() {
      this.editable = true;
    },
  },
};
</script>

<style scoped>
.editable-cell {
  position: relative;
  margin-top: -9px;
  margin-bottom: -9px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
.editable-cell-input-wrapper.single-edit,
.editable-cell-text-wrapper.single-edit {
  padding-right: 24px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}
.editable-cell-icon {
  top: 3px;
  line-height: 18px;
  display: none;
}
.editable-cell-icon-check {
  top: 12px;
}

.no-validate {
  margin-bottom: 0;
}
</style>
