export type DateConstraintReason = 'min' | 'max' | 'unavailable' | 'conflict'

export interface EvaluateDateInput {
  date: Date | undefined
  minValue?: Date
  maxValue?: Date
}

export type DateWorkflowState =
  | { isSelectable: true; reason?: never }
  | { isSelectable: false; reason: DateConstraintReason }

/**
 * Thin workflow seam so date UI can consume domain decisions
 * without hard-coupling to a specific state-machine runtime.
 */
export interface DateWorkflowAdapter {
  evaluateDate(input: EvaluateDateInput): DateWorkflowState
}
