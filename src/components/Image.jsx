import React from 'react';

export default function ImageWithFallback({ fallback, src, ...props}) {
    const [imgSrc, setImgSrc] = React.useState(src);
    const onError = () => setImgSrc(fallback);

    return <img src={imgSrc ? imgSrc : fallback} onError={onError} alt="" {...props} />;
}