import { CldUploadWidget } from 'next-cloudinary';

<CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}>
    {({ open }) => {
        return (
            <button onClick={() => open()}>
                Upload a video
            </button>
        );
    }}
</CldUploadWidget>