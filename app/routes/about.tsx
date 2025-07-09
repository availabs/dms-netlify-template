import { Link } from 'react-router'
let isServer = typeof document === "undefined";
let env = isServer ? "server" : "client";

export const loader = async({ request, params }) => {

  return  { 
    content:  (
        <div>
          <h1 className="p-8 text-3xl font-bold underline">
          About Page! Test 123 {env} 
          </h1>
          <div>DMS_APP {import.meta.env.VITE_DMS_APP} {import.meta.env.VITE_DMS_APP}</div>
          <div>DMS_TYPE {import.meta.env.VITE_DMS_TYPE}</div>
        </div>
    )
  }
}

export default function Home ({loaderData}) {
  const {content} = loaderData 
  return (
      <div className='w-screen h-screen bg-slate-100'>
        {content}
        <div>{import.meta.env.VITE_DMS_APP}</div>
        <div>{import.meta.env.VITE_DMS_TYPE}</div>
        <Link to='/'>Home</Link>
        
      </div>
  )
}