import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '../hooks/useTheme';

interface PieChartProps {
  current: number;
  goal: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}

const PieChart: React.FC<PieChartProps> = ({
  current,
  goal,
  size = 120,
  strokeWidth = 8,
  showPercentage = true
}) => {
  const { colors, currentTheme } = useTheme();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(current / goal, 1);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress * circumference);
  
  const percentage = Math.round((current / goal) * 100);
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.background.dark}
          strokeWidth={strokeWidth}
          opacity={0.3}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.accent}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out',
            filter: currentTheme === 'darknight' 
              ? `drop-shadow(0 0 8px ${colors.accent}60)`
              : 'none'
          }}
        />
      </svg>
      
      {/* Center text */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        {showPercentage && (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: colors.textColorLight,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              lineHeight: 1,
            }}
          >
            {percentage}%
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            color: colors.secondary,
            fontSize: { xs: '0.7rem', md: '0.8rem' },
            mt: 0.5,
          }}
        >
          {current.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default PieChart;
