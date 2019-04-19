/**
 * asset:{type}{-dimension?}:{url}
 *
 * Helper protocol to serve site favicons and avatars from the cache.
 * Examples:
 * 
 *  - asset:favicon:dat://beakerbrowser.com
 *  - asset:favicon-32:dat://beakerbrowser.com
 *  - asset:thumb:dat://beakerbrowser.com
 *  - asset:cover:dat://beakerbrowser.com
 **/

import {protocol, screen} from 'electron'
import * as beakerCore from '@beaker/core'
const {sitedata} = beakerCore.dbs
import fs from 'fs'
import path from 'path'

const NOT_FOUND = -6 // TODO I dont think this is the right code -prf

export function setup () {
  var DEFAULTS = {
    favicon: {type: 'image/png', data: NOT_FOUND},
    thumb: {type: 'image/jpeg', data: NOT_FOUND},
    cover: {type: 'image/jpeg', data: NOT_FOUND}
  }

  // load defaults
  fs.readFile(path.join(__dirname, './assets/img/default-favicon.png'), (err, buf) => {
    if (err) { console.error('Failed to load default favicon', path.join(__dirname, './assets/img/default-favicon.png'), err) }
    if (buf) { DEFAULTS.favicon.data = buf }
  })
  fs.readFile(path.join(__dirname, './assets/img/default-user-thumb.jpg'), (err, buf) => {
    if (err) { console.error('Failed to load default thumb', path.join(__dirname, './assets/img/default-user-thumb.jpg'), err) }
    if (buf) { DEFAULTS.thumb.data = buf }
  })
  fs.readFile(path.join(__dirname, './assets/img/default-cover.jpg'), (err, buf) => {
    if (err) { console.error('Failed to load default cover', path.join(__dirname, './assets/img/default-cover.jpg'), err) }
    if (buf) { DEFAULTS.cover.data = buf }
  })

  // detect if is retina
  let display = screen.getPrimaryDisplay()
  const isRetina = display.scaleFactor >= 2

  // register favicon protocol
  protocol.registerBufferProtocol('asset', async (request, cb) => {
    // parse the URL
    let {asset, url, size} = parseAssetUrl(request.url)
    if (isRetina) {
      size *= 2
    }

    // validate
    if (asset !== 'favicon' && asset !== 'thumb' && asset !== 'cover') {
      return cb({data: NOT_FOUND})
    }

    // if beaker://, pull from hard-coded assets
    if (url.startsWith('beaker://')) {
      let name = /beaker:\/\/([^\/]+)/.exec(url)[1]
      if (url.startsWith('beaker://library/?view=addressbook')) name = 'addressbook'
      if (url.startsWith('beaker://library/?view=bookmarks')) name = 'bookmarks'
      if (url.startsWith('beaker://library/?view=websites')) name = 'websites'
      return fs.readFile(path.join(__dirname, `./assets/img/favicons/${name}.png`), (err, buf) => {
        if (buf) cb({mimeType: 'image/png', data: buf})
        else cb(DEFAULTS[asset])
      })
    }

    try {
      // look up in db
      let data = await sitedata.get(url, asset)
      if (data) {
        // `data` is a data url ('data:image/png;base64,...')
        // so, skip the beginning and pull out the data
        let parts = data.split(',')
        let mimeType = /data:([^;]+);base64/.exec(parts[0])[1]
        data = parts[1]
        if (data) {
          return cb({ mimeType, data: Buffer.from(data, 'base64') })
        }
      }
    } catch (e) {
      // ignore
      console.log(e)
    }

    cb(DEFAULTS[asset])
  }, e => {
    if (e) { console.error('Failed to register asset protocol', e) }
  })
}

const ASSET_URL_RE = /^asset:([a-z]+)(-\d+)?:(.*)/
function parseAssetUrl (str) {
  const match = ASSET_URL_RE.exec(str)
  return {
    asset: match[1],
    size: (+match[2]) || 16,
    url: match[3]
  }
}
