const checkUpdate = () => {
  const updateManager = wx.getUpdateManager()
  updateManager.onCheckForUpdate(function (res) {
    // 请求完新版本信息的回调
    if (res.hasUpdate) {
      wx.showLoading({
        title: '正在更新',
      })
    }
  })

  updateManager.onUpdateReady(function () {
    wx.hideLoading()
    wx.showModal({
      title: '更新提示',
      content: '新版本已经准备好，请重启应用',
      showCancel: false,
      mask: true,
      success(res) {
        if (res.confirm) {
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          updateManager.applyUpdate()
        }
      }
    })
  })

  updateManager.onUpdateFailed(function () {
    // 新版本下载失败
  })
}

module.exports = {
  checkUpdate: checkUpdate
}
