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
          <div>DMSAPP {process.env.DMSAPP}</div>
          <div>DMS_APP2 {process.env.DMS_APP2}</div>
        </div>
    )
  }
}

export default function Home ({loaderData}) {
  const {content} = loaderData 
  return (
      <div className='w-screen h-screen bg-slate-100'>
        {content}
        <Link to='/'>Home</Link>
        
      </div>
  )
}