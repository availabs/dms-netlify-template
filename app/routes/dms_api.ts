import React, { useEffect, useMemo } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router';

import {
  dmsDataLoader,
  dmsDataEditor
} from '../modules/dms/src/api/index.js'

import DmsManager from '../modules/dms/src/dms-manager'

import pageConfig from '../modules/dms/src/patterns/page/siteConfig.jsx'

import {
  falcorGraph,
  FalcorProvider,
  useFalcor
} from "../modules/avl-falcor"

import { falcor } from '../server/falcor.ts'

// ----------------------------------------------------
// -------------- Config Setup-------------------------
// ----------------------------------------------------
const authWrapper = Component => Component

let {
  API_HOST = 'https://graph.availabs.org',
  baseUrl = ""
} = {}

//const dmsPath= `${baseUrl}${baseUrl === '/' ? '' : '/'}`
const clientFalcor = falcorGraph(API_HOST)
let dmsConfig = pageConfig?.[0]({
    // app: "mitigat-ny-prod",
    // type: "redesign",
    app: "dms-site",
    type: "docs-npmrds",
    // app: "dms-docs",
    // type: "test",
    useFalcor: useFalcor,
    baseUrl: "",
    //checkAuth
  })
// -------------- Config Setup--------------------------
  

// export const loader = async({ request, params }) => {
//   //console.log('loader config', dmsConfig)
//   console.log('dms_api', request, params)
//   const { falcor } = await import('../server/falcor.ts')
//   let data =  await dmsDataLoader(falcor, dmsConfig, `/${params['*'] || ''}`)
//   console.timeEnd('loader data')

//   return data
// }

export const action = async ({ request, params }) => {
  console.time('dms-api-action')
  const form = await request.formData();
  //console.log('dms_api - action - request', request)
  let requestType = form.get("requestType")
  if(requestType === 'data') {
    return await dmsDataLoader(falcor, dmsConfig, form.get("path"))
  }
  //return {}
  const resp =  dmsDataEditor(falcor,
    dmsConfig,
    JSON.parse(form.get("data")),
    requestType,
    form.get("path")
  )
  console.timeEnd('dms-api-action')
  return resp
};




