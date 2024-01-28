import Image from "next/image"
import Link from "next/link"

const Logo = () => {
    return (
        <Link href={'/'}>
            <div className="flex items-center justify-center gap-2">
                <Image
                    width={30}
                    height={30}
                    alt="logo"
                    src="/logo.svg"
                />
                <h1 className="text-2xl font-bold text-[#0369a1]">Learnitees</h1>
            </div>
        </Link>

    )
}

export default Logo
