import type { RulesDiagramDocument } from './types'

export const sampleRulesDiagramModelDocument: RulesDiagramDocument = {
  version: 1,
  id: 'checkout-discount-rule',
  title: 'Checkout discount rule',
  nodes: [
    {
      id: 'order-received',
      kind: 'event',
      label: 'Order received',
      description: 'Checkout event from storefront',
    },
    {
      id: 'vip-check',
      kind: 'condition',
      label: 'Customer is VIP?',
      expression: {
        language: 'dsl',
        source: 'customer.tier in ["gold", "platinum"]',
      },
      branches: [
        {
          id: 'yes',
          label: 'yes',
          expression: { language: 'dsl', source: 'customer.tier in ["gold", "platinum"]' },
          targetNodeId: 'cart-total-check',
        },
        {
          id: 'no',
          label: 'no',
          isDefault: true,
          targetNodeId: 'standard-pricing',
        },
      ],
    },
    {
      id: 'cart-total-check',
      kind: 'condition',
      label: 'Cart total over $500?',
      expression: {
        language: 'dsl',
        source: 'cart.total_cents > 50000',
      },
      branches: [
        {
          id: 'yes',
          label: 'yes',
          expression: { language: 'dsl', source: 'cart.total_cents > 50000' },
          targetNodeId: 'apply-vip-discount',
        },
        {
          id: 'no',
          label: 'no',
          isDefault: true,
          targetNodeId: 'standard-pricing',
        },
      ],
    },
    {
      id: 'apply-vip-discount',
      kind: 'action',
      label: 'Apply VIP discount',
      action: {
        type: 'discount.apply',
        label: 'Apply 15% discount',
        parameters: {
          percent: 15,
          reason: 'vip_high_value_cart',
        },
      },
    },
    {
      id: 'standard-pricing',
      kind: 'action',
      label: 'Use standard pricing',
      action: {
        type: 'pricing.keep',
        label: 'No promotional adjustment',
      },
    },
    {
      id: 'finish',
      kind: 'end',
      label: 'Return pricing decision',
    },
  ],
  transitions: [
    {
      id: 'order-vip-check',
      sourceNodeId: 'order-received',
      targetNodeId: 'vip-check',
      label: 'evaluate',
    },
    {
      id: 'discount-finish',
      sourceNodeId: 'apply-vip-discount',
      targetNodeId: 'finish',
      label: 'done',
    },
    {
      id: 'standard-finish',
      sourceNodeId: 'standard-pricing',
      targetNodeId: 'finish',
      label: 'done',
    },
  ],
  layout: {
    nodes: {
      'order-received': { x: 80, y: 220 },
      'vip-check': { x: 360, y: 180 },
      'cart-total-check': { x: 680, y: 120 },
      'apply-vip-discount': { x: 1010, y: 90 },
      'standard-pricing': { x: 1010, y: 330 },
      finish: { x: 1320, y: 220 },
    },
    viewport: { x: -20, y: 10, zoom: 0.78 },
  },
}
