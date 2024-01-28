'use client'
import { Puff } from 'react-loader-spinner'
const DashboardLoading = () => {
    return (
        <div className='h-full flex justify-center items-center'>
            <Puff
                visible={true}
                height="80"
                width="80"
                color="#0369a1"
                ariaLabel="puff-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    )
}

export default DashboardLoading
