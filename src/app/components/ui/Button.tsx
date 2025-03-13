import React from 'react';

const Button: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        
            <button
                type="button"
                className="py-2 px-6 inline-flex items-center gap-x-2 text-sm font-medium text-white bg-white/10 rounded-[40px] rounded-tr-lg rounded-br-[55px] backdrop-blur-md hover:bg-white/30 focus:outline-none focus:bg-white/30 disabled:opacity-30 disabled:pointer-events-none"
            >
                {children}
            </button>
        
    );
}

export default Button;
