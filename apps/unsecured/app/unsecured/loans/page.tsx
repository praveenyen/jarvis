import Link from 'next/link'
import React from 'react'

const Loans = () => {
  return (
    <div>Loans

        <Link href="/unsecured" className='rounded border bg-blue-500 text-white p-4'>Go to Unsecured Home</Link>
    </div>
  )
}

export default Loans