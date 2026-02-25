/**
 * SkeletonLoader Component
 * 
 * Displays skeleton loading placeholders while data is fetching.
 * Implements STORY-2.4 AC10: Loading states with skeleton loaders
 * 
 * @component
 * @example
 * <SkeletonLoader count={5} />
 */

import React from 'react';
import styles from './SkeletonLoader.module.css';

interface SkeletonLoaderProps {
  /** Number of skeleton rows to display */
  count?: number;
  /** Height of each skeleton row in pixels */
  rowHeight?: number;
  /** Show as table rows or generic blocks */
  variant?: 'rows' | 'blocks';
}

/**
 * Skeleton loader component for showing loading state
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  count = 3,
  rowHeight = 60,
  variant = 'rows',
}) => {
  const skeletonRows = Array.from({ length: count }, (_, i) => i);

  if (variant === 'blocks') {
    return (
      <div className={styles.skeletonContainer}>
        {skeletonRows.map((i) => (
          <div
            key={i}
            className={styles.skeletonBlock}
            style={{ height: `${rowHeight}px` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.skeletonTableContainer}>
      <table className={styles.skeletonTable}>
        <tbody>
          {skeletonRows.map((i) => (
            <tr key={i} className={styles.skeletonRow}>
              <td className={styles.skeletonCell}>
                <div className={styles.skeletonLine} style={{ width: '70%' }} />
              </td>
              <td className={styles.skeletonCell}>
                <div className={styles.skeletonLine} style={{ width: '50%' }} />
              </td>
              <td className={styles.skeletonCell}>
                <div
                  className={styles.skeletonLine}
                  style={{ width: '60%', borderRadius: '12px' }}
                />
              </td>
              <td className={styles.skeletonCell}>
                <div className={styles.skeletonLine} style={{ width: '40%' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonLoader;
