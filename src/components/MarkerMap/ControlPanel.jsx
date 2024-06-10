import * as React from 'react';
// import "./stylesheet.css"
import CITIES from './cities.json';

import { Fragment } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function ControlPanel({tiers,setMapStyle}) {

    console.log(tiers)
   
    const handleClick = React.useCallback((item) => {
        setMapStyle(item.style);
      }, [setMapStyle]);
  return (

<Menu as="div" className="relative inline-block text-left" style={{float:"right",}}>
      <div >
        <MenuButton  className="inline-flex w-full justify-center items-center gap-x-1 
        rounded bg-white px-3 py-2 text-xs font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          Theme
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </MenuButton>
      </div>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-3/5 origin-top-right 
        rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" style={{overflow:"",overflowY:"auto",maxHeight:"10px"}}
        >
          <div className="" >
            {tiers && tiers?.feature.map((item, index) => (
            <MenuItem key={index} > 
              {({ focus }) => (
                <div key={`btn-${index}`} className="" >
                <a  className={classNames(
                    focus ? 'bg-gray-100 text-gray-900' : 'text-gray-600',
                    ' text-xs'
                  )}
                  onClick={(e) => handleClick(item)}>
                  <label htmlFor={`city-${index}`}>{item.name}</label>
                  </a>
                </div>
              )}
            </MenuItem>
                  ))}

    
      
          </div>
        </MenuItems>
      </Transition>
    </Menu>

  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(ControlPanel);
