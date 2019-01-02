<template>
  <div>
    <Row>
      <Col span="8">
        <Button type="primary" icon="plus-round" @click='addRowModal'>添加文章</Button>
      </Col>
    </Row>
    <Card>
      <tables :columns="columns" v-model="DataList"></tables>
      <Page class-name="mTop15" :total="pageTotal" :current="pageNum" :page-size="pageSize" show-elevator show-sizer
            show-total :page-size-opts="[10, 20, 50, 100, 200]"
            placement="top" @on-change="handlePage" @on-page-size-change='handlePageSize'></Page>

    </Card>
    <modify :modalShow="modifyModalStatus" @on-close="closeModal"  @modify-finished="fetchTableData" :propsData="modifyRowData" :statusList="statusList" :channelData="channelList"></modify>
  </div>
</template>

<script>
  import Tables from '_c/tables'
  import {getArticle, getArticleList, delArticle,saveArticleStatus} from '@/api/article'
  import {getChannelList} from '@/api/channel'
  import {statusList} from '@/config/params'
  import Modify from './modify.vue'
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
            title: '是否启用',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('i-switch', {
                  // 数据库1是启用，0是禁用
                  props: {
                    type: 'primary',
                    value: params.row.status === 0
                    // 控制开关的打开或关闭状态，官网文档属性是value
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    'on-change': (value) => {
                      // 触发事件是on-change,用双引号括起来，
                      // 参数value是回调值，并没有使用到
                      this.switchRow(params.row.id,params.row.status)
                      // params.index是拿到table的行序列，可以取到对应的表格值
                    }
                  }
                })
              ])
            }
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
                        this.modifyModal(params.row.id)
                      }
                    }
                  }, '修改'),
                  // 删除使用 Poptip 进行一次确认
                  h('Poptip', {
                    props: {
                      confirm: true,
                      title: '您确定要删除这条数据吗?',
                      transfer: true
                    },
                    on: {
                      'on-ok': () => {
                        this.delRow(params.row.id)
                      }
                    }
                  }, [
                    h('Button', {
                      style: {
                        margin: '0 3px'
                      },
                      props: {
                        type: 'error',
                        placement: 'top',
                        size: 'small'
                      }
                    }, '删除')
                  ])
                ])
              }
            ]
          }

        ],
        DataList: [],
        channelList:[],
        statusList: statusList,
        modifyRowData: {},
        modifyModalStatus: false
      }
    },
    //存放axios方法
    methods: {

      //提交的axios
      fetchTableData() {
        getArticleList(this.pageNum, this.pageSize).then(res => {
          if (res.data.code === 0) {
            this.DataList = res.data.data.list;
            this.pageTotal = res.data.data.total;
          } else {
            alert(res.data.message);
          }
        })
      },

      fetchRowData(id) {
        getArticle(id).then(res => {
          this.modifyRowData = res.data.data
        })
      },

      //page翻页
      handlePage(value) {
        this.pageNum = value;
        this.fetchTableData();
      },
      handlePageSize(value) {
        this.pageSize = value;
        this.fetchTableData();
      },


      // 添加记录弹框
      addRowModal () {
        this.$nextTick(() => {
          this.modifyModalStatus = true
          this.modifyRowData = {}
        })
      },

      // 修改弹框
      modifyModal (id) {
        // 清空数据变量
        this.modifyRowData = {}
        //重新拉取本数据
        this.fetchRowData(id)
        this.$nextTick(() => {
          this.modifyModalStatus = true
        })
      },

      //关闭弹出层
      closeModal(data) {
        this.$nextTick(() => {
          this.$emit('on-close', 'close');
          this.modifyModalStatus = false;
        });
      },
      fetchChannelData () {
        // this.channelList = {};
        getChannelList().then(res => {
          this.channelList = res.data.data.list
        })
      },

      // 切换记录状态
      switchRow (id, status) {
        let _this = this;
        saveArticleStatus(id, status===1?0:1).then(function (data) {
          if (data.data.code === 0) {
            _this.$Message.success('切换成功!');
            _this.fetchTableData();
          } else {
            _this.$Message.error(data.data.message)
          }
        })
          .catch(function (error) {
            _this.$Message.error(error)
          })
      },

      // 删除记录
      delRow(id) {
        let _this = this;
        delArticle(id).then(function (data) {
          console.log(data);
          if (data.data.code === 0) {
            _this.$Message.success('删除成功!');
            _this.fetchTableData();
          } else {
            _this.$Message.error(data.data.message)
          }
        })
          .catch(function (error) {
            _this.$Message.error(error)
          })
      }


    },
    //调用axios获取页面初始化所需的数据
    mounted() {
      this.fetchTableData();
      this.fetchChannelData();
    }

  }
</script>
<style>
  button{margin: 0 1px !important;}
</style>
