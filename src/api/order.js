import {axiosds, axiosG, axiosK, axiosL, axiosP} from './request'

// 录入更改订单
const editOrderUrl = 'hdd/addL_order';

export function editOrderApi(data) {
  return axiosK(editOrderUrl, data)
}

// 删除订单
const deleteOrderUrl = 'hdd/deleteL_order?longs=';

export function deleteOrderApi(data) {
  return axiosds(deleteOrderUrl, data)
}

// 获得订单
const getOrderUrl = 'hdd/getL_order?';

export function getOrderApi(data) {
  return axiosG(getOrderUrl + data)
}

// 搜索订单
const searchOrderUrl = 'hdd/searchL_order?';

export function searchOrderApi(data) {
  return axiosG(searchOrderUrl + data)
}

// 导出订单
const exportOrderUrl = 'hdd/export?';

export function exportOrderApi(data) {
  axiosL(exportOrderUrl + data)
      .then(response => {
        let blob = new Blob([response.data]);
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '订单数据.xls'; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
      })
}

// 获取所有网点
const getAllSiteUrl = 'hdd/getallUser';

export function getAllSiteApi() {
  return axiosG(getAllSiteUrl)
}
