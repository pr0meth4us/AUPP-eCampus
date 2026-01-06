// src/components/ForcedAvatar.jsx
import React, { useState } from 'react';
import { Avatar } from '@heroui/react';
import { UserIcon } from '@heroicons/react/24/outline';

const ForcedAvatar = ({ src, size = 144 }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Avatar
      isBordered
      isRounded
      classNames={{
        base: `relative overflow-hidden border-4 border-white`,
        image: loaded
          ? 'opacity-100 transition-opacity duration-500'
          : 'opacity-0',
        fallback: 'opacity-0',
      }}
      css={{
        w: `${size}px`,
        h: `${size}px`,
      }}
    >
      <img
        src={src}
        alt="avatar"
        onLoad={() => setLoaded(true)}
        className="w-full h-full object-cover"
      />

      {(!src || !loaded) && (
        <UserIcon className="absolute top-1/2 left-1/2 w-16 h-16 text-gray-500 -translate-x-1/2 -translate-y-1/2" />
      )}
    </Avatar>
  );
};

export default ForcedAvatar;
