import { useState } from 'react';

export default function useGundamModel() {
  const [info, setInfo] = useState<any>({});

  return {
    info,
    setInfo,
  };
}
