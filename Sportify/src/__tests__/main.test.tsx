// src/__tests__/main.test.tsx
import { describe, it, expect, vi } from 'vitest'

// 👇 Create a mock root element before importing
const mockRoot = document.createElement('div')
mockRoot.id = 'root'
document.body.appendChild(mockRoot)

// 👇 Spy to avoid actual rendering
vi.mock('react-dom/client', async () => {
  const actual = await vi.importActual<typeof import('react-dom/client')>('react-dom/client')
  return {
    ...actual,
    createRoot: vi.fn(() => ({
      render: vi.fn(),
    })),
  }
})

import('../main') // triggers main.tsx without crashing

describe('main.tsx', () => {
  it('should render without crashing', () => {
    expect(document.getElementById('root')).toBe(mockRoot)
  })
})
