import { SemiCircleProgress, Stack, Text, Transition } from '@mantine/core';
import { useMemo } from 'react';

type TBureauScoreIndicator = {
  score: number;
  size?: number;
  colorMap?: Record<string, string>;
};

/**
 * @function TBureauScoreIndicator
 * @description A visual indicator of Bureau score that ranges from 0 to 900.
 * @param {number} score - The credit score
 * @param {number} [size=200] - Component size
 * @param {Record<string, string>} [colorMap={}] - Color scheme
 * @returns {JSX.Element} - JSX Element
 */

export const BureauScoreIndicator = ({
  score,
  size,
  colorMap,
}: TBureauScoreIndicator) => {
  const scaleConvertor = useMemo(() => (score / 900) * 100, [score]);

  return (
    <SemiCircleProgress
      fillDirection="left-to-right"
      orientation="up"
      size={size && size * 1.1 || 170}
      filledSegmentColor={
        scaleConvertor < 62
          ? 'error.6'
          : scaleConvertor > 62 && scaleConvertor > 62 && scaleConvertor < 80
            ? 'yellow'
            : 'green'
      }
      value={scaleConvertor}
      thickness={15}
      label={
        <Stack gap={0}>
          <Text size="lg" fw={700}>
            {score ? score : '-'}
          </Text>
          <Text size="xs">Credit Score</Text>
        </Stack>
      }
    />
  );
};
