import React, { useEffect, useMemo } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router';

import {
  dmsDataLoader,
  dmsDataEditor
} from '../modules/dms/src/api/index.js'

import DmsManager from '../modules/dms/src/dms-manager'

import pageConfig from '../modules/dms/src/patterns/page/siteConfig.jsx'
import adminConfig from '../modules/dms/src/patterns/admin/siteConfig.jsx'

import {
  falcorGraph,
  FalcorProvider,
  useFalcor
} from "../modules/avl-falcor"

const getSubdomain = (host) => {
    // ---
    // takes window.location.host and returns subdomain
    // only works with single depth subdomains 
    // ---
    //console.log('host', host,  host.split('.'));
    if (process.env.NODE_ENV === "development") {
        return host.split('.').length >= 2 ?
            host.split('.')[0].toLowerCase() :
                false
    } else {
        return host.split('.').length > 2 ?
            host.split('.')[0].toLowerCase() :
                false
    }
}
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
// let dmsConfig = adminConfig({
//     app: "mitigat-ny-prod",
//     type: "prod",
//     baseUrl: "",
//     //checkAuth
// })
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
  

export const loader = async({ request, params }) => {
  // console.log('loader config', dmsConfig)
  // console.log('dms - loader - host', getSubdomain(request.headers.get('host')))
  const { falcor } = await import('../server/falcor.ts')

  let data =  await dmsDataLoader(falcor, dmsConfig, `/${params['*'] || ''}`)
  //console.log('dms - server loader- data', data[0].patterns)
  const AuthedManager= authWrapper(DmsManager)
  const content = (
      <AuthedManager
        path={ `/${params['*'] || ''}` }
        config={dmsConfig}
        falcor={clientFalcor}
    />
  )
  return {
    data,
    content
  }
}

export const action = async ({ request, params }) => {
  const { falcor } = await import('../server/falcor.ts')
  const form = await request.formData();
  //return {}
  return dmsDataEditor(falcor,
    dmsConfig,
    JSON.parse(form.get("data")),
    form.get("requestType"),
    params['*']
  )
};

export function HydrateFallback() {
  return <div>Loading Screen</div>;
}

export const clientLoader = async({ request, params }) => {
  var body = new FormData();
  body.append("path",  `/${params['*'] || ''}`)
  body.append("requestType",  "data")
  //console.log('loader config', dmsConfig)
  console.time('loader data')
  let res =  await fetch(`/dms_api`, { method:"POST", body })
  let data = await res.json()
  //console.log('data', data)
  console.timeEnd('loader data')

  return {
    data
  }
}



export const clientAction = async ({ request, params }) => {
  const form = await request.formData();
  form.append('path', params['*'])
  //return {}
  console.time('action  data')
  let res =  await fetch(`/dms_api`, {
      method:"POST", 
      body: form
  })
  let data = await res.json()
  console.timeEnd('action  data')
  
  return data
  // return dmsDataEditor(falcor,
  //   dmsConfig,
  //   JSON.parse(form.get("data")),
  //   form.get("requestType"),
  //   params['*']
  // )
};




export default function DMS({loaderData}) {
  const params = useParams();
  //const { content } = loaderData
  //console.log('hello world', dmsConfig, DmsManager)
  const AuthedManager= authWrapper(DmsManager)
  const content = (
      <AuthedManager
        path={ `/${params['*'] || ''}` }
        config={dmsConfig}
        falcor={clientFalcor}
    />
  )
  return (<>{content}</>)
  
}

