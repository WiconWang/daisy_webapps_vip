<template>
  <div>
    <Modal :closable="false"  :mask-closable="false"  :value="modalShow" title="记录详细"   width="700">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <FormItem label="栏目" prop="cid">
          <label>
            <Select v-model="formValidate.cid">
              <Option v-for="item in channelData" :value="item.id" :key="item.id">{{ item.title }}</Option>
            </Select>
          </label>
        </FormItem>
        <FormItem label="标题：" prop="title">
          <Input v-model="formValidate.title" placeholder="输入文章标题"></Input>
        </FormItem>
        <FormItem label="小标题：" prop="short_title">
          <Input v-model="formValidate.short_title" placeholder="输入备用的小标题"></Input>
        </FormItem>
        <FormItem label="关键词：" prop="keyword">
          <Input v-model="formValidate.keyword" placeholder="请输入关键词，5~6个词，英文逗号分隔"></Input>
        </FormItem>
        <FormItem label="摘要：" prop="description">
          <Input v-model="formValidate.description" placeholder="请输入摘要，对本文章进行概述，约255字以内"></Input>
        </FormItem>
	        <FormItem label="封面图：">
          <Row>
            <Col span="12">
              <Button type="info" icon="ios-cloud-upload-outline">上传图片</Button>
              <input id="cover" name="file" type="file" accept="image/png,image/gif,image/jpeg"
                     @change="(value) => uploadCover(value, 'cover')" style="position: absolute;left: 0;top: 0;opacity: 0;"/>
            </Col>
          </Row>
          <br/>
          <Row>
            <img :src="cover_show" style="width:120px;"/>
          </Row>
          <b>封面图：本页面显示的顶图，不需要请留空</b>
        </FormItem>

        <FormItem label="缩略图：">
          <Row>
            <Col span="12">
              <Button type="info" icon="ios-cloud-upload-outline">上传图片</Button>
              <input id="thumbnail" name="file" type="file" accept="image/png,image/gif,image/jpeg"
                     @change="(value) => uploadCover(value, 'thumbnail')" style="position: absolute;left: 0;top: 0;opacity: 0;"/>
            </Col>
          </Row>
          <br/>
          <Row>
            <img :src="thumbnail_show" style="width:120px;"/>
          </Row>
          <b>缩略图：在列表、首页调用时所用，注意一般都有严格的尺寸要求，请事先确认处理后上传</b>
        </FormItem>
        <FormItem label="内容：" prop="content">
          <editor ref="editor" :value="formValidate.content" v-model="formValidate.content" placeholder="输入文章内容"/>
        </FormItem>
        <FormItem label="状态" prop="status">
          <RadioGroup v-model="formValidate.status">
            <Radio v-for="item in statusList" :key="item.value" :label="item.value" :value="item.value">{{
              item.label}}
            </Radio>
          </RadioGroup>
          <p class="gray">禁用后，禁止其它模块调用、禁用前台展示，除非特别指定使用此记录</p>
        </FormItem>
        <FormItem label="权重" prop="weight">
          <InputNumber v-model="formValidate.weight" placeholder="权重，数值越大，站点显示时优先靠前"></InputNumber>
          <p class="gray">权重最小为0，最大1000，前台会按大到小顺序排序</p>
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
  import {uploadImage} from '@/api/common'
  import default_pic from '@/assets/images/default_pic.png'

  export default {
    name: 'modify',
    props: {
      modalShow: {
        type: Boolean,
        default: false
      },
      propsData: Object,
      channelData: Array,
      statusList: Array
    },
    components: {
      Editor
    },
    data() {
      return {
        id: 0,
        cover_show: default_pic,
        thumbnail_show: default_pic,
        // 定义表单的初始值
        formValidate: {
          cid: 1,
          title: '',
          cover: '',
          thumbnail:'',
          content: '',
          status: 0,
          weight: 0,
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

          //注意 select 区默认值为 string，需要在验证时 transform 成 Number 再进行验证，否则一定报错
          status: [
            {required: true, message: '状态不能为空', trigger: 'change', type: 'number'},
            {
              type: 'number', min: 0, max: 1, message: '状态不能为空', trigger: 'change', transform(value) {
                return Number(value);
              }
            }

          ],
          weight: [
            {required: true, message: '权重不能为空', trigger: 'change', type: 'number'},
            {
              type: 'number', min: 0, max: 1000, message: '权重最小为0，最大1000 ', trigger: 'change', transform(value) {
                return Number(value);
              }
            }

          ],
          // content: [
          //   {required: true, message: '内容不能为空', trigger: 'change'},
          //   {min: 1,  message: '内容最少1个字'}
          // ],
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
            let ajaxFunc = (_this.id === 0) ? addArticle(params) : editArticle(params, _this.id);
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
      },


      // 对页面字段进行赋值
      getFields(label, content) {
        if (content == '' || content == null) return false;
        switch (label) {
          case 'thumbnail':
            this.formValidate.thumbnail = content;
            this.thumbnail_show = this.$config.baseDomain + content;
            break;
          case 'cover':
            this.formValidate.cover = content;
            this.cover_show = this.$config.baseDomain + content;
            break;
        }
      },

      // 上传照片
      uploadCover(e, name) {
        let _this = this;
        let file = e.target.files[0];
        let param = new FormData();
        param.append('file', file);
        param.append('folder', 'cover');
        if (["image/jpeg", "image/png", "image/gif", "image/webp"].indexOf(file.type) < 0) {
          _this.$Message.error({duration: 5, content: '失败：网页只支持jpg, jpeg, png, gif, webp这几种格式，请用图像软件转换格式'});
          return false;
        }
        if ((file.size / 1024 / 1024) > 2) {
          _this.$Message.error({duration: 5, content: '失败：超过 2M 或者超过 2550px 宽度的图片，网页极易无法加载显示，请尽量进行压缩后上传!'});
          return false;
        }
        // 添加请求头
        uploadImage(param).then(response => {
          if (response.data.code === 0) {
            _this.getFields(name, response.data.data.path)
          }
        });
      }
    },
    watch: {
      propsData(value) {
        // 如果不是空对象时，对表格进行赋值,否则则重新初始化默认值
        if (Object.keys(value).length !== 0) {
          console.log(value)
          this.id = value.id;
          // 依次赋值是为了保证在后续axios的时候，不会带入不需要的字段
          this.formValidate.cid = value.cid;
          this.formValidate.title = value.title;
          this.formValidate.short_title = value.short_title;
          this.formValidate.keyword = value.keyword;
          this.formValidate.description = value.description;
          this.formValidate.cover = value.cover;
          this.cover_show = (value.cover=='' || value.cover.substring(0, 4) === 'http') ? value.cover : this.$config.baseDomain + value.cover;
          this.formValidate.thumbnail = value.thumbnail;
          this.thumbnail_show = ( value.thumbnail=='' || value.thumbnail.substring(0, 4) === 'http'  ) ? value.thumbnail : this.$config.baseDomain + value.thumbnail;
          this.formValidate.status = value.status;
          this.formValidate.weight = value.weight;
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
