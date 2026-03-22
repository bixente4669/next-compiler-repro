import { useState } from 'react';

// Bare <T> on arrow function in .ts — SWC 56 misparses as JSX,
// causing isReactCompilerRequired() to skip the entire file.
const useMyHook = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue);
  return { setValue, value };
};

export default useMyHook;
