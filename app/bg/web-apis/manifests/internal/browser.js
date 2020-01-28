export default {
  createEventsStream: 'readable',
  getInfo: 'promise',
  checkForUpdates: 'promise',
  restartBrowser: 'sync',

  getUserSession: 'promise',
  setUserSession: 'promise',
  showEditProfileModal: 'promise',

  getSettings: 'promise',
  getSetting: 'promise',
  setSetting: 'promise',
  updateSetupState: 'promise',
  setStartPageBackgroundImage: 'promise',
  getDefaultProtocolSettings: 'promise',
  setAsDefaultProtocolClient: 'promise',
  removeAsDefaultProtocolClient: 'promise',

  listBuiltinFavicons: 'promise',
  getBuiltinFavicon: 'promise',
  uploadFavicon: 'promise',
  imageToIco: 'promise',

  fetchBody: 'promise',
  downloadURL: 'promise',
  readFile: 'promise',

  getResourceContentType: 'sync',

  executeSidebarCommand: 'promise',
  toggleSiteInfo: 'promise',
  toggleLiveReloading: 'promise',
  setWindowDimensions: 'promise',
  setWindowDragModeEnabled: 'promise',
  setSidebarResizeModeEnabled: 'promise',
  moveWindow: 'promise',
  maximizeWindow: 'promise',
  showOpenDialog: 'promise',
  showContextMenu: 'promise',
  showModal: 'promise',
  openUrl: 'promise',
  gotoUrl: 'promise',
  getPageUrl: 'promise',
  refreshPage: 'promise',
  focusPage: 'promise',
  executeJavaScriptInPage: 'promise',
  injectCssInPage: 'promise',
  uninjectCssInPage: 'promise',
  openFolder: 'promise',
  doWebcontentsCmd: 'promise',
  doTest: 'promise',
  closeModal: 'sync'
}
