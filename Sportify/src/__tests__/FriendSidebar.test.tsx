// src/__tests__/FriendSidebar.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FriendSidebar from '../Components/FriendSidebar'
import { NotificationProvider } from '../context/NotificationContext'

// 1) Mock the API module at the top level:
vi.mock('../services/api', () => ({
  fetchMyFriends: vi.fn(),
  fetchFriendRequests: vi.fn(),
  searchUsers: vi.fn(),
  sendFriendRequest: vi.fn(),
  acceptFriendRequest: vi.fn(),
  declineFriendRequest: vi.fn(),
  removeFriend: vi.fn(),
}))

import {
  fetchMyFriends,
  fetchFriendRequests,
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} from '../services/api'

// wrap them so TS knows these are mocks
const fetchMyFriendsMock      = vi.mocked(fetchMyFriends)
const fetchFriendRequestsMock = vi.mocked(fetchFriendRequests)
const searchUsersMock         = vi.mocked(searchUsers)
const sendFriendRequestMock   = vi.mocked(sendFriendRequest)
const acceptFriendRequestMock = vi.mocked(acceptFriendRequest)
const declineFriendRequestMock = vi.mocked(declineFriendRequest)

describe('FriendSidebar', () => {
  beforeEach(() => {
    localStorage.setItem('userId', '1')
    vi.resetAllMocks()

    fetchMyFriendsMock.mockResolvedValue([
      {
        id: 1,
        user: { userId: 1, name: 'Alice', email: 'alice@example.com' },
        profile: {
          userId: 1,
          profilePicture: 'alice.jpg',
          bio: '',
          favoriteSports: '',
          totalPoints: 42,
        },
        status: 'accepted',
      },
    ])

    fetchFriendRequestsMock.mockResolvedValue([
      {
        id: 2,
        user: { userId: 2, name: 'Bob', email: 'bob@example.com' },
        profile: {
          userId: 2,
          profilePicture: 'bob.jpg',
          bio: '',
          favoriteSports: '',
          totalPoints: 7,
        },
        status: 'pending',
      },
    ])

    // default no search results
    searchUsersMock.mockResolvedValue([])
  })

  afterEach(() => {
    localStorage.clear()
  })

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <NotificationProvider>
          <FriendSidebar />
        </NotificationProvider>
      </MemoryRouter>
    )

  it('displays search results when typing in search box', async () => {
    searchUsersMock.mockResolvedValue([
      {
        id: 3,
        user: { userId: 3, name: 'Charlie', email: 'charlie@example.com' },
        profile: {
          userId: 3,
          profilePicture: 'charlie.jpg',
          bio: '',
          favoriteSports: '',
          totalPoints: 5,
        },
        status: 'none',
      },
    ])

    renderComponent()
    await waitFor(() => screen.getByText('Alice'))

    const searchInput = screen.getByPlaceholderText(/search users/i)
    fireEvent.change(searchInput, { target: { value: 'Char' } })

    await waitFor(() => {
      expect(screen.getByText('Charlie')).toBeInTheDocument()
    })
  })

  it('send friend request button works', async () => {
    searchUsersMock.mockResolvedValue([
      {
        id: 3,
        user: { userId: 3, name: 'Charlie', email: 'charlie@example.com' },
        profile: {
          userId: 3,
          profilePicture: 'charlie.jpg',
          bio: '',
          favoriteSports: '',
          totalPoints: 5,
        },
        status: 'none',
      },
    ])

    renderComponent()
    await waitFor(() => screen.getByText('Alice'))

    const searchInput = screen.getByPlaceholderText(/search users/i)
    fireEvent.change(searchInput, { target: { value: 'Char' } })

    const sendButton = await screen.findByRole('button', { name: /send request/i })
    fireEvent.click(sendButton)

    expect(sendFriendRequestMock).toHaveBeenCalledWith({ senderId: 1, receiverId: 3 })

    await waitFor(() => {
      expect(screen.queryByText('Charlie')).not.toBeInTheDocument()
    })
  })

it('accepts a friend request and removes it from the list', async () => {
    renderComponent()
    // wait for Bob to appear in requests
    await waitFor(() => screen.getByText('Bob'))

    // grab the accept button by its CSS class
    const acceptBtn = document.querySelector<HTMLButtonElement>('.accept-btn')
    expect(acceptBtn).toBeInTheDocument()

    fireEvent.click(acceptBtn!)
    // ensure API called
    expect(acceptFriendRequestMock).toHaveBeenCalledWith(2)

    // Bob should disappear
    await waitFor(() => {
      expect(screen.queryByText('Bob')).toBeNull()
    })
  })

  it('declines a friend request and removes it from the list', async () => {
    renderComponent()
    await waitFor(() => screen.getByText('Bob'))

    const declineBtn = document.querySelector<HTMLButtonElement>('.decline-btn')
    expect(declineBtn).toBeInTheDocument()

    fireEvent.click(declineBtn!)
    expect(declineFriendRequestMock).toHaveBeenCalledWith(2)

    await waitFor(() => {
      expect(screen.queryByText('Bob')).toBeNull()
    })
  })
})
