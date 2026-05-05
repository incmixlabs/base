'use client'

import { Search } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { TextField, type TextFieldProps } from './TextField'

export interface SearchInputProps extends Omit<TextFieldProps, 'leftIcon' | 'type'> {
  /** Override the default search icon. */
  icon?: React.ReactNode
}

/** SearchInput export. */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ icon = <Search />, placeholder = 'Search...', inputMode, enterKeyHint = 'search', className, ...props }, ref) => {
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
