import React from 'react';
import { colors } from '../../config/colors';

interface FormIconProps {
  children: React.ReactNode;
}

const FormIcon: React.FC<FormIconProps> = ({ children }) => {
  return (
    <div className="flex justify-center mb-4">
      <div 
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: colors.primary.main }}
      >
        <div className="w-5 h-5" style={{ color: 'white' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormIcon;
