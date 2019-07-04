<template>
  <div>
    <a-button class="editable-add-btn" @click="handleAdd">Add</a-button>
    <a-table bordered :dataSource="dataSource" :columns="columns">

      <template slot="name" slot-scope="text, record">
        <editable-cell :ref="`name_${record.key}`" :defaultEditable="record.editable" :required="true" message='请输入公司名称！' :value="text" :text="text" @change="onCellChange(record.key, 'name', $event)" />
      </template>

      <template slot="age" slot-scope="text, record">
        <editable-cell :ref="`age_${record.key}`" decoratorType="integer" :min="10" :max="34" formType="number" :defaultEditable="record.editable" :required="true" message='请输入数字' :value="text" :text="text" @change="onCellChange(record.key, 'age', $event)" />
      </template>

      <template slot="birthday" slot-scope="text, record">
        <editable-cell :ref="`birthday_${record.key}`" formType="datePicker" :defaultEditable="record.editable" :required="true" message='请输入日期' :value="moment(text, dateFormat)" :text="text" @change="onCellChange(record.key, 'birthday', $event)" />
      </template>

      <template slot="country" slot-scope="text, record">
        <editable-cell :ref="`countryCode_${record.key}`" formType="select" :defaultEditable="record.editable" :required="true" message='请选择国籍' :value="record.countryCode" :text="record.countryName" @change="onCellChange(record.key, 'countryCode', $event)">
          <a-select-option value="01">
            China
          </a-select-option>
          <a-select-option value="02">
            U.S.A
          </a-select-option>
        </editable-cell>
      </template>

      <template slot="hasCar" slot-scope="text, record">
        <editable-cell :ref="`hasCar_${record.key}`" formType="switch" :defaultEditable="record.editable" :required="true" message='请选择是否有car' :value="text" :text="()=>{
          if (text){
            return '有';
          }
          return '没有';
        }" @change="onCellChange(record.key, 'hasCar', $event)" />
      </template>

      <template slot="address" slot-scope="text, record">
        <editable-cell :text="text" @change="onCellChange(record.key, 'address', $event)" />
      </template>

      <template slot="operation" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a-popconfirm v-if="dataSource.length" title="Sure to delete?" @confirm="() => onDelete(record.key)">
            <span>
              <a href="javascript:;">删除</a>
            </span>
          </a-popconfirm>
          <span v-if="record.editable">
            <a @click="() => save(record.key)">保存</a>
            <a-popconfirm title='Sure to cancel?' @confirm="() => cancel(record.key)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="() => edit(record.key)">编辑</a>
          </span>
        </div>
      </template>

    </a-table>

    <a-button type="primary" @click="handleSave">提交</a-button>
    <ul>
      <li>当前行数据：
        <pre>{{JSON.stringify(signData,null,2)}}</pre>
      </li>
      <li>批量多行数据：
        <pre>{{JSON.stringify(mulData,null,2)}}</pre>
      </li>
    </ul>
  </div>
</template>
<script>
import EditableCell from '../src';
import moment from 'moment';

/*
* EditableCell Code https://github.com/vueComponent/ant-design-vue/blob/master/components/table/demo/EditableCell.vue
*/
export default {
  components: {
    EditableCell,
  },
  data() {
    return {
      signData: [],
      mulData: [],
      dateFormat: 'YYYY-MM-DD',
      dataSource: [
        {
          key: '0',
          name: 'Edward King 0',
          age: 16,
          hasCar: true,
          countryCode: '01',
          countryName: 'china',
          birthday: '2016-06-18',
          address: 'London, Park Lane no. 0',
        },
        {
          key: '1',
          name: 'Edward King 1',
          age: 33,
          hasCar: false,
          countryCode: '02',
          countryName: 'USA',
          birthday: '2008-12-05',
          address: 'London, Park Lane no. 1',
        },
      ],
      count: 2,
      columns: [
        {
          title: 'key',
          dataIndex: 'key',
        },
        {
          title: 'name',
          dataIndex: 'name',
          width: '30%',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: 'age',
          dataIndex: 'age',
          width: '150px',
          scopedSlots: { customRender: 'age' },
        },
        {
          title: '日期',
          dataIndex: 'birthday',
          scopedSlots: { customRender: 'birthday' },
        },
        {
          title: '国籍',
          scopedSlots: { customRender: 'country' },
        },
        {
          title: '汽车',
          dataIndex: 'hasCar',
          scopedSlots: { customRender: 'hasCar' },
        },
        {
          title: 'address',
          dataIndex: 'address',
          scopedSlots: { customRender: 'address' },
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
        },
      ],
    };
  },
  methods: {
    moment,
    onCellChange(key, dataIndex, value) {
      // console.log(dataIndex, value);
      // const dataSource = [...this.dataSource];
      // const target = dataSource.find(item => item.key === key);
      // if (target) {
      //   if (dataIndex === 'birthday') {
      //     target[dataIndex] = value.format('YYYY-MM-DD');
      //   } else {
      //     target[dataIndex] = value;
      //   }
      //   this.dataSource = dataSource;
      // }
    },
    onDelete(key) {
      // 拷贝数组数据
      const dataSource = [...this.dataSource];
      // 过滤移除当前项目
      this.dataSource = dataSource.filter(item => item.key !== key);
    },
    edit(key) {
      const newData = [...this.dataSource];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        target.editable = true;
        this.dataSource = newData;
      }
    },
    save(key) {
      let fields = ['name', 'age', 'birthday','hasCar','countryCode'];
      this.validateRow(key, fields, (err, values) => {
        if (!err) {
          values.birthday = values.birthday.format('YYYY-MM-DD');
          const newData = [...this.dataSource];
          const row = newData.find(item => key === item.key);
          if (row) {
            // 用户数据合并到原对象上
            Object.assign(row, values);
            delete row.editable;
            this.signData = row;
            console.log('单行保存row', row);
            // target 保存了最新行数据，可以提价到后台
            this.dataSource = newData;
          }
        }
      });
    },
    cancel(key) {
      const newData = [...this.dataSource];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        delete target.editable;
        this.dataSource = newData;
      }
    },
    // validateRow可以提取为公共函数
    validateRow(key, fields, callback) {
      // 查找验证是否通过
      const row = {};
      let err = false;
      // forEach 对每一个验证，可以更改为some满足一个就提醒
      fields.forEach(filed => {
        let refName = `${filed}_${key}`;
        let result = this.$refs[refName].validate();
        row[filed] = result.value;
        if (!result.success) {
          err = true;
        }
      });
      callback(err, row);
    },
    // 批量提交保存数据
    handleSave() {
      let fields = ['name', 'age', 'birthday','hasCar','countryCode'];
      const newData = [...this.dataSource];
      // 找出处于可编辑行
      const rows = newData.filter(row => {
        return row.editable;
      });
      let count = 0;
      // 一个个校验行
      rows.forEach(row => {
        this.validateRow(row.key, fields, (err, values) => {
          if (!err) {
            values.birthday = values.birthday.format('YYYY-MM-DD');
            // 行记录数据合并到row中
            Object.assign(row, values);
            count++;
          }
        });
      });
      // 最终数据在rows中;
      if (rows.length === count) {
        // 数据在rows,提交数据
        this.mulData = rows;
        console.log('批量多行rows', rows);
      }
    },
    handleAdd() {
      const { count, dataSource } = this;
      const newData = {
        key: count,
        name: '',
        age: '',
        hasCar: true,
        birthday: moment().format('YYYY-MM-DD'),
        address: '',
        countryCode: '02',
        editable: true,
      };
      this.dataSource = [...dataSource, newData];
      this.count = count + 1;
    },
  },
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
li {
  text-align: left;
}
pre {
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.65);
  color: #ccc;
}
</style>
