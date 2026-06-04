'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { TextField, type TextFieldProps } from './TextField'

export interface SearchInputProps extends Omit<TextFieldProps, 'leftIcon' | 'type'> {
  /** Override the default search icon. */
  icon?: TextFieldProps['leftIcon']
}

/** SearchInput export. */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ icon = 'search', placeholder = 'Search...', inputMode, enterKeyHint = 'search', className, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        type="search"
        inputMode={inputMode ?? 'search'}
        enterKeyHint={enterKeyHint}
        placeholder={placeholder}
        leftIcon={icon}
        className={cn('w-full', className)}
        {...props}
      />
    )
  },
)

SearchInput.displayName = 'SearchInput'
