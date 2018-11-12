<template>
  <div>
    <Row>
      <Col span="8">
        <Button type="primary" icon="plus-round" @click='addLayerShow'>添加文章</Button>
      </Col>
    </Row>
    <Card>
      <tables :columns="columns" v-model="propsData"></tables>
      <Page class-name="mTop15" :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer
            show-total :page-size-opts="[10, 20, 50, 100, 200]"
            placement="top" @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>

    </Card>
    <modify :modalShow="modifyLayer" @on-close="closeModal"  @modify-finished="fetchData" :propsData="modifyLayerData" :channelData="channelList"></modify>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import {getArticle, getArticleList, delArticle} from '@/api/article'
  import Modify from './modify-article.vue'
  export default {
    name: 'tables_page',
    components: {
      Tables,
      Modify,
    },
    data() {
      return {
        pageTotal: 0,
        pageNum: 1,
        pageSize: 10,
        columns: [
          {
            title: 'id',
            key: 'id',
            width: 100,
          },
          {
            title: '标题',
            key: 'title',
          },
          {
            title: '备用标题',
            key: 'short_title',
          },
          {
            title: '操作',
            key: 'handle',
            width: 200,
            button: [
              (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.editUser(params.row.id)
                      }
                    }
                  }, '修改'),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.delArticle(params.row.id)
                      }
                    }
                  }, '删除')
                ])
              }
            ]
          }

        ],
        propsData: {},
        channelList:{},
        modifyLayerData: {},
        modifyLayer: false
      }
    },
    //存放axios方法
    methods: {
      //page翻页
      handlePage(value) {
        this.pageNum = value;
        this.fetchData();
      },
      handlePageSize(value) {
        this.pageSize = value;
        this.fetchData();
      },
      //提交的axios
      fetchData() {
        getArticleList(this.pageNum, this.pageSize).then(res => {
          if (res.data.code === 0) {
            this.propsData = res.data.data.list;
            this.pageTotal = res.data.data.total;
          } else {
            alert(res.data.message);
          }
        })
      },
      //添加
      addLayerShow() {
        this.openModal({})
      },
      //打开弹出层
      openModal(data) {
        this.$nextTick(() => {
          this.modifyLayer = true
          this.modifyLayerData = data
        })
      },
      // 添加弹框
      editUser(id) {
        this.modifyLayerData = {};
        this.fetchArticleData(id);
        this.openModal(this.modifyLayerData)
      },
      fetchArticleData(id) {
        getArticle(id).then(res => {
          this.modifyLayerData = res.data.data
        })
      },
      //关闭弹出层
      closeModal(data) {
        this.$nextTick(() => {
          this.$emit('on-close', 'close');
          this.modifyLayer = false;
        });
      },
      delArticle(id) {
        let _this = this;
        delArticle(id).then(function (data) {
          if (data.data.code === 0) {

            _this.$Message.success('删除成功!');
            _this.fetchData();
          } else {
            _this.$Message.error(data.data.message)
          }
        })
          .catch(function (error) {
            _this.$Message.error(error)
          })
      },

      fetchChannelData () {
        this.channelList = {};
        // getChannelList().then(res => {
        //   this.channelList = res.data.data
        // })
      },

    },
    //调用axios获取页面初始化所需的数据
    created() {
      this.fetchData();
      this.fetchChannelData();
    }

  }
</script>
<style>
  button{margin: 0 1px !important;}
</style>
