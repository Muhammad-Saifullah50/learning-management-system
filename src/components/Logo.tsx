import Image from "next/image"

const Logo = () => {
    return (
        <div className="flex items-center justify-center gap-2">
            <Image
                width={30}
                height={30}
                alt="logo"
                src="/logo.svg"
            />
            <h1 className="text-2xl font-bold text-[#007DFC]">Learnitees</h1>
        </div>

    )
}

export default Logo
