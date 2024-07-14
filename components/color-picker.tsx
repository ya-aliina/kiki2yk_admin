import { useState } from 'react';

import {
  HsvaColor,
  hsvaToRgbaString,
  color as handleColor,
  validHex,
  hexToHsva,
  hsvaToHex,
  hsvaToHexa,
} from '@uiw/color-convert';

import Chrome from '@uiw/react-color-chrome';
import { GithubPlacement } from '@uiw/react-color-github';

function ColorPicker() {
  const [hsva, setHsva] = useState({ h:0, s:25.71, v:82.35, a:0.32});
  const hex = hsvaToHex(hsva)
  return (
    <>
      <div className='w-10 h-10 rounded-full relative' style={{background: hex}}>
      </div>

      <Chrome
        color={hsva}
        placement={GithubPlacement.TopLeft}
        onChange={(color) => {
          setHsva(color.hsva);
        }}
        className='absolute'
      />
    </>
  );
}
export default ColorPicker;