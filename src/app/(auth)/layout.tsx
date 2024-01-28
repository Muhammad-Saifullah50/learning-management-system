import React from 'react'

export const metadata = {
    title: {
      template: '%s - Learnitees',
    },
  }
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className='h-full flex items-center justify-center'>
            {children}
        </div>
    )
}

export default AuthLayout
