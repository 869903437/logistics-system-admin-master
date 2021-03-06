<template>
  <div id="help">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-input placeholder="搜索"
                  v-model="siteText"
                  style="width: 200px"
                  clearable
                  @keyup.enter.native="getSite">
        </el-input>
        <el-button type="success" @click="getSite">搜索</el-button>
        <el-button style="float: right" type="primary" @click="add">新增</el-button>
      </div>
      <div>
        <el-table
                v-loading="isTableLoading"
                :data="formData">
          <el-table-column
                  prop="c__branchesName"
                  label="网点名称">
          </el-table-column>
          <el-table-column
                  prop="username"
                  label="编号">
          </el-table-column>
          <el-table-column
                  prop="c_br_phone"
                  label="联系方式">
          </el-table-column>
          <el-table-column
                  prop="c_br_address"
                  label="地址">
          </el-table-column>
          <el-table-column
                  prop="c_jili"
                  label="经理">
          </el-table-column>
          <el-table-column label="级别">
            <template slot-scope="scope">
              <span v-if="scope.row.is_special">特殊</span>
              <span v-else-if="scope.row.authorities[0].authority == 'level'">超管</span>
              <span v-else-if="scope.row.authorities[0].authority == 'level0'">总部</span>
              <span v-else-if="scope.row.authorities[0].authority == 'level1'">一级网点</span>
              <span v-else="scope.row.authorities[0].authority == 'level2'">二级网点</span>
            </template>
          </el-table-column>

          <el-table-column label="是否可修改密码">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.u_canupdate" @change="changeIsCanChangePassword(scope.row)"></el-switch>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" class="el-icon-edit" @click="edit(scope.row)" size="mini">
              </el-button>
              <el-popover
                      :ref="scope.row.u_id"
                      placement="top"
                      width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.u_id].doClose()">取消</el-button>
                  <el-button :loading="isDeleteLoading" type="primary" size="mini"
                             @click.stop="deleteSite(scope.row.u_id)">确定
                  </el-button>
                </div>
                <el-button :disabled="isDisabled(scope.row)" slot="reference" type="danger" icon="el-icon-delete"
                           size="mini"
                           @click.stop></el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <pagination ref="pagination" @getNewData="getSite"></pagination>
      </div>
    </el-card>
    <add-site ref="AddSite" @update="getSite"></add-site>
    <edit-site ref="EditSite" @update="getSite"></edit-site>
  </div>
</template>

<script>
  import {getSiteApi, deleteSiteApi, changeIsCanChangePasswordApi} from '@/api/site'
  import AddSite from './add'
  import EditSite from './edit'
  import pagination from '@/components/pagination'
  import {objectEvaluate} from "@/utils/common";

  export default {
    name: 'Site',
    components: {EditSite, AddSite, pagination},
    data() {
      return {
        formData: [],
        isTableLoading: false,
        isDeleteLoading: false,
        siteText: '',
        isDeleteMoreDisabled: true,
        deleteList: []
      }
    },
    computed: {
      userId() {
        return this.$store.getters.userId
      },
      role() {
        return this.$store.getters.user.authorities[0].authority
      }
    },
    mounted() {
      this.getSite();
    },
    methods: {
      isDisabled(obj) {
        let objRole = obj.authorities[0].authority;
        return objRole === 'level';
      },
      getSite() {
        this.isTableLoading = true;
        let pagination = this.$refs.pagination.pagination;
        let role;
        if (this.role === 'level') role = -1;
        if (this.role === 'level0') role = 0;
        if (this.role === 'level1') role = 1;
        if (this.role === 'level2') role = 2;
        let param = `pageNumber=${pagination.current}&pageCount=${pagination.size}&u_id=${this.userId}&role=${role}&s=${this.siteText}`;
        getSiteApi(param).then(result => {
          this.isTableLoading = false;
          this.formData = result.data.message;
          pagination.total = result.data.status
        })
      },
      changeIsCanChangePassword(obj) { // 是否可修改密码
        let data = {};
        data.u_id = obj.u_id;
        data.id = this.userId;
        let i;
        if (obj.u_canupdate) i = 1;
        else i = 0;
        data.i = i;
        changeIsCanChangePasswordApi(data);
      },
      add() { // 添加网点
        this.$refs.AddSite.dialogTableVisible = true
      },
      edit(obj) { // 编辑网点
        let _this = this.$refs.EditSite;
        obj.password = '';
        objectEvaluate(obj, _this.form);
        _this.dialogTableVisible = true
      },
      deleteSite(id) { // 删除网点
        this.isDeleteLoading = true;
        deleteSiteApi([id])
            .then(() => {
              this.isDeleteLoading = false;
              this.$refs[id].doClose();
              this.getSite()
            })
            .catch(() => {
              this.isDeleteLoading = false;
              this.$refs[id].doClose()
            });
      }
    }
  }
</script>

<style lang="scss">
  #help {

  }
</style>
