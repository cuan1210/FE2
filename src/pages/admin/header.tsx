import { FaUserCircle } from "react-icons/fa"
import { GrLogin } from "react-icons/gr"
import { Link } from "react-router-dom"

const AdminHeader = () => {
    return (
        <header className='bg-white w-full shadow-md flex p-4 relative z-50'>
            <div className='logo w-1/5'>
                <Link to={'/admin'}>Nguyễn Hồng Quân</Link>
            </div>
            <div className='right-header w-4/5 flex justify-between'>
                <form>
                    <input className='border rounded-md w-[350px] px-2 py-1' type='text' placeholder='Tìm kiếm'/>
                </form>
                {/* <ul className="flex gap-3 text-[22px]">
                    <li>
                        <Link to={'/user'}>
                            <FaUserCircle />
                        </Link>
                    </li>

                    <li>
                        <Link to={'/user'}>
                            <GrLogin />
                        </Link>
                    </li>
                </ul> */}
            </div>
        </header>
    )
    }

export default AdminHeader