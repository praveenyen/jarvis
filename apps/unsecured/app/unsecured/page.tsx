import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>Unsecured Loans

        <Link href="/unsecured/loans" className='rounded border bg-blue-500 text-white p-4'>Loans</Link>
    </div>
  )
}

export default page