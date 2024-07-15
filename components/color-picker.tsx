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
import { cn } from '@/lib/utils';

import Chrome from '@uiw/react-color-chrome';
import { GithubPlacement } from '@uiw/react-color-github';

function ColorPicker() {
    const [hsva, setHsva] = useState({ h: 0, s: 25.71, v: 82.35, a: 0.32 });
    const hex = hsvaToHex(hsva)
    const [isVisible, setIsVisible] = useState(false)
    return (
        <>
            <div
                className='w-10 h-10 rounded-full relative cursor-pointer' 
                style={{ background: hex }}
                onClick={() => setIsVisible(!isVisible)}                
            >
            </div>

            <div
                className={cn(
                    'absolute !mt-0',
                    isVisible
                        ? 'block'
                        : 'hidden',
                )}
            >
                <Chrome
                    color={hsva}
                    placement={GithubPlacement.TopLeft}
                    onChange={(color) => {
                        setHsva(color.hsva);
                    }}
                    style={{ 'borderRadius': '16px', overflow: 'hidden' }}
                />
            </div>
        </>
    );
}
export default ColorPicker;

// style={{ position: 'absolute', 'marginTop': '0px' }}