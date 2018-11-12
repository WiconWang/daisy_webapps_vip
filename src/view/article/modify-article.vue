<template>
  <div>
    <Modal :closable="false" :mask-closable="false" :value="modalShow" title="文章录入" width="800">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <!--<FormItem label="栏目" prop="cid">-->
          <!--<Select v-model="formValidate.cid" placeholder="栏目">-->
            <!--<Option v-for="item in channelData.list" :value="item.id" :key="item.id">{{ item.id }}:  {{ item.title }} </Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
        <FormItem label="栏目ID" prop="cid">
          <Input v-model="formValidate.cid" readonly placeholder="栏目ID"></Input>
        </FormItem>
        <FormItem label="标题：" prop="title">
          <Input v-model="formValidate.title" placeholder="输入文章标题"></Input>
        </FormItem>
        <FormItem label="小标题：" prop="short_title">
          <Input v-model="formValidate.short_title" placeholder="输入备用的小标题"></Input>
        </FormItem>
        <FormItem label="内容：" prop="content">
          <editor ref="editor" :value="formValidate.content" v-model="formValidate.content" placeholder="输入文章内容"/>
        </FormItem>
      </Form>
        <div slot="footer">
          <Button size="large" @click="cancel">取消</Button>
          <Button type="primary" size="large" @click="okSubmit('formValidate')">确定</Button>
        </div>
    </Modal>
  </div>
</template>
<script>

  import {editArticle, addArticle} from '@/api/article'
  import Editor from '_c/editor'

  export default {
    name: 'modifyArticle',
    props: {
      modalShow: {
        type: Boolean,
        default: false
      },
      propsData: Object,
      channelData: Object,
    },
    components: {
      Editor
    },
    data() {
      return {
        aid: 0,
        formValidate: {
          cid: 1,
          title: '',
          content: '',
          short_title: '',
        },
        ruleValidate: {
          // cid: [
          //   {required: true, message: '栏目不能为空', trigger: 'change'},
          // ],
          title: [
            {required: true, message: '标题不能为空', trigger: 'change'},
            {min: 6, max: 100, message: '标题长度在6-100之间'}
          ],
          short_title: [
            {required: true, message: '短标题不能为空', trigger: 'change'},
            {min: 4, max: 40, message: '短标题长度在4-40之间'}
          ],
          content: [
            {required: true, message: '内容不能为空', trigger: 'change'},
          ],
        },
      };
    },
    methods: {
      // 表单提交
      okSubmit(name) {
        let _this = this
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = this.$data.formValidate
            let ajaxFunc = (_this.aid === 0) ? addArticle(params) : editArticle(params, _this.aid);
            ajaxFunc.then(function (data) {
              if (data.data.code === 0) {
                _this.$Message.success('操作成功!');
                _this.$emit('modify-finished');
                _this.cancel();
              } else {
                _this.$Message.error(data.data.message)
              }
            })
              .catch(function (error) {
                _this.$Message.error(error)
              })
          } else {
            _this.$Message.error('参数验证失败，请检查参数是否正确!')
          }
        })
      },
      cancel() {
        this.$emit('on-close', 'close');
      }
    },
    watch: {
      propsData(value) {
        // 如果不是空对象时，对表格进行赋值,否则则重新初始化默认值
        if (Object.keys(value).length !== 0) {
          this.aid = value.id;
          // 依次赋值是为了保证在后续axios的时候，不会带入不需要的字段
          this.formValidate.cid = value.cid;
          this.formValidate.title = value.title;
          this.formValidate.short_title = value.short_title;
          this.formValidate.content = value.content;
          this.$refs.editor.setHtml(value.content);
        } else {
          this.$refs.editor.setHtml('');
          Object.assign(this.$data, this.$options.data());
        }
      }
    }
  };
</script>
