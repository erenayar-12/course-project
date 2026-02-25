/**
 * IdeaSortDropdown Component (P1.2)
 * 
 * Sort dropdown for organizing ideas by date or title.
 * Implements STORY-2.4 AC2: Sort ideas by 4 options
 * 
 * @component
 * @example
 * <IdeaSortDropdown
 *   sortBy="createdAt"
 *   sortOrder="DESC"
 *   onChange={(sortBy, sortOrder) => console.log(sortBy, sortOrder)}
 * />
 */

import React from 'react';

export type SortBy = 'createdAt' | 'title';
export type SortOrder = 'ASC' | 'DESC';

interface SortOption {
  value: string;
  label: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

interface IdeaSortDropdownProps {
  /** Current sort field (createdAt or title) */
  sortBy: SortBy;
  /** Current sort order (ASC or DESC) */
  sortOrder: SortOrder;
  /** Callback fired when sort changes */
  onChange: (sortBy: SortBy, sortOrder: SortOrder) => void;
  /** Enable/disable the sort control */
  disabled?: boolean;
}

/**
 * Sort dropdown for organizing ideas (AC2)
 */
export const IdeaSortDropdown: React.FC<IdeaSortDropdownProps> = ({
  sortBy,
  sortOrder,
  onChange,
  disabled = false,
}) => {
  const sortOptions: SortOption[] = [
    {
      value: 'createdAt-DESC',
      label: 'Date Created (Newest First)',
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    },
    {
      value: 'createdAt-ASC',
      label: 'Date Created (Oldest First)',
      sortBy: 'createdAt',
      sortOrder: 'ASC',
    },
    {
      value: 'title-ASC',
      label: 'Title (A-Z)',
      sortBy: 'title',
      sortOrder: 'ASC',
    },
    {
      value: 'title-DESC',
      label: 'Title (Z-A)',
      sortBy: 'title',
      sortOrder: 'DESC',
    },
  ];

  const currentValue = `${sortBy}-${sortOrder}`;

  const handleChange = (value: string) => {
    const option = sortOptions.find((opt) => opt.value === value);
    if (option) {
      onChange(option.sortBy, option.sortOrder);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="sort-dropdown" className="text-sm font-medium text-gray-700">
        Sort By
      </label>
      <select
        id="sort-dropdown"
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        data-testid="sort-dropdown"
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
        `}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
