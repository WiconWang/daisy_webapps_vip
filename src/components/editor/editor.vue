<template>
  <div class="editor-wrapper">
    <div id="editorMenu"></div>
    <div class="editor_body" :id="editorId"></div>
  </div>
</template>
<style>
  /*.editor_body{*/
  /*height: 400px;*/
  /*width: auto;*/
  /*}*/
  .w-e-text, .w-e-text-container {
    height: 400px !important;
  }
</style>

<script>
  import Editor from 'wangeditor'
  import 'wangeditor/release/wangEditor.min.css'
  import {oneOf} from '@/libs/tools'
  import {getToken} from '@/libs/util'

  export default {
    name: 'Editor',
    props: {
      value: {
        type: String,
        default: ''
      },
      /**
       * 绑定的值的类型, enum: ['html', 'text']
       */
      valueType: {
        type: String,
        default: 'html',
        validator: (val) => {
          return oneOf(val, ['html', 'text'])
        }
      },
      /**
       * @description 设置change事件触发时间间隔
       */
      changeInterval: {
        type: Number,
        default: 200
      },
      /**
       * @description 是否开启本地存储
       */
      cache: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      editorId() {
        return `editor${this._uid}`
      }
    },
    methods: {
      setHtml(val) {
        this.editor.txt.html(val)
      }
    },
    mounted() {
      this.editor = new Editor(`#${this.editorId}`);
      this.editor.customConfig.onchange = (html) => {
        let text = this.editor.txt.text()
        if (this.cache) localStorage.editorCache = html
        this.$emit('input', this.valueType === 'html' ? html : text)
        this.$emit('on-change', html, text)
      };
      this.editor.customConfig.uploadImgHeaders = {
        // 'Content-Type': 'form-data',
        'Authorization': 'Bearer ' + getToken(),
      };

      this.editor.customConfig.menus = [
        'head',
        'bold',
        'fontSize',  // 字号
        'fontName',  // 字体
        'italic',  // 斜体
        'underline',  // 下划线
        'strikeThrough',  // 删除线
        'foreColor',  // 文字颜色
        'backColor',  // 背景颜色
        'quote',  // 引用
        'image',  // 插入图片
        'table',  // 表格
      ];

      this.editor.customConfig.onchangeTimeout = this.changeInterval;
      this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024;
      this.editor.customConfig.uploadImgMaxLength = 20;
      const baseUrlink = process.env.NODE_ENV === 'development' ? this.$config.baseUrl.dev : this.$config.baseUrl.pro
      this.editor.customConfig.uploadImgServer = baseUrlink + '/upload/editorimage';

      this.editor.customConfig.pasteFilter = true;

      // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
      this.editor.customConfig.pasteTextHandle = function (content) {
        //把换行符转成其它第三方符号
        content = content.replace(new RegExp('<br>','g'), '##PTAGS##');
        content = content.replace(new RegExp('</p>','g'), '##PTAGS##');
        content = content.replace(new RegExp('</h1>','g'), '##PTAGS##');
        content = content.replace(new RegExp('</h2>','g'), '##PTAGS##');
        content = content.replace(new RegExp('</h3>','g'), '##PTAGS##');
        // 去掉所有的html标记
        content =content.replace(/<!-([\s\S]*)->/g, '').replace(/<[^>]+>/g, '').replace('  ', '');
        //换行符
        content = content.replace(new RegExp('##PTAGS##','g'), '</p>\n<p>');
        // 去除空格
        content = content.replace(/(^\s*)|(\s*$)/g, "");
        return '<p>' + content +'</p>';
        // var regEx = /(<a[^>]*>)|(<[^>]a>)/g;
        // return content.replace(regEx, "");
      };

      // create这个方法一定要在所有配置项之后调用
      this.editor.create();
      // 如果本地有存储加载本地存储内容
      // let html = this.value || localStorage.editorCache
      let html = this.value;
      if (html) this.editor.txt.html(html)
    }
  }
</script>

<style>

</style>
