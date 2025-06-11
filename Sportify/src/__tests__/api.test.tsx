import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchEvents,
  fetchSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  fetchProfile,
  loginUser,
  fetchInvitedEvents,
  acceptInvite,
  rejectInvite,
  fetchEventsByUser,
  fetchEventParticipants,
  fetchPendingRequests,
  approveRequest,
  rejectRequest,
  unassignAchievement,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  fetchMyFriends,
  fetchFriendRequests,
  searchUsers,
  fetchUserById,
  fetchAllAchievements,
} from '../services/api';

describe('API Service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const mockEvent = {
    eventId: 1,
    title: 'Test Event',
    location: 'Gauteng',
    startDateTime: new Date().toISOString(),
    endDateTime: new Date().toISOString(),
  };

  const mockProfile = {
    userId: 1,
    profilePicture: 'profile.jpg',
    name: 'Test User'
  };

  const mockLoginResponse = {
    token: 'mock-token',
    userId: 1,
  };

  const mockUser = { userId: 1, name: 'User' };

  // === EVENTS ===
  it('fetchEvents - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([mockEvent]) })));
    const res = await fetchEvents();
    expect(res).toEqual([mockEvent]);
  });

  it('fetchEvents - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })));
    await expect(fetchEvents()).rejects.toThrow();
  });

  it('fetchSingleEvent - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockEvent) })));
    const res = await fetchSingleEvent(1);
    expect(res).toEqual(mockEvent);
  });

  it('fetchSingleEvent - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })));
    await expect(fetchSingleEvent(1)).rejects.toThrow();
  });

  it('createEvent - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockEvent) })));
    const res = await createEvent(mockEvent, 1);
    expect(res).toEqual(mockEvent);
  });

  it('createEvent - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, text: () => Promise.resolve('error') })));
    await expect(createEvent(mockEvent, 1)).rejects.toThrow();
  });

  it('updateEvent - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockEvent) })));
    const res = await updateEvent(1, mockEvent);
    expect(res).toEqual(mockEvent);
  });

  it('updateEvent - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, text: () => Promise.resolve('fail') })));
    await expect(updateEvent(1, mockEvent)).rejects.toThrow();
  });

  it('deleteEvent - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(deleteEvent(1)).resolves.toBeUndefined();
  });

  it('deleteEvent - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, text: () => Promise.resolve('fail') })));
    await expect(deleteEvent(1)).rejects.toThrow();
  });

  it('joinEvent - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(joinEvent(1, 1)).resolves.toBeUndefined();
  });

  it('joinEvent - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, text: () => Promise.resolve('fail') })));
    await expect(joinEvent(1, 1)).rejects.toThrow();
  });

  // === PROFILE ===
  it('fetchProfile - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockProfile) })));
    const res = await fetchProfile(1);
    expect(res).toEqual(mockProfile);
  });

  it('fetchProfile - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })));
    await expect(fetchProfile(1)).rejects.toThrow();
  });

  // === LOGIN ===
  it('loginUser - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockLoginResponse) })));
    const res = await loginUser({ email: 'test@test.com', password: '1234' });
    expect(res).toEqual(mockLoginResponse);
  });

  it('loginUser - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })));
    await expect(loginUser({ email: 'test@test.com', password: '1234' })).rejects.toThrow();
  });

  // === INVITES ===
  it('fetchInvitedEvents - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([mockEvent]) })));
    const res = await fetchInvitedEvents(1);
    expect(res).toEqual([mockEvent]);
  });

  it('acceptInvite - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(acceptInvite(1, 1)).resolves.toBeUndefined();
  });

  it('rejectInvite - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false, text: () => Promise.resolve('rejected') })));
    await expect(rejectInvite(1, 1)).rejects.toThrow('rejected');
  });

  // === Additional APIs ===
  it('fetchEventsByUser - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([mockEvent]) })));
    const res = await fetchEventsByUser(1);
    expect(res).toEqual([mockEvent]);
  });

  it('fetchEventParticipants - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([mockUser]) })));
    const res = await fetchEventParticipants();
    expect(res).toEqual([mockUser]);
  });

  it('fetchPendingRequests - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([{ userId: 2 }]) })));
    const res = await fetchPendingRequests(1);
    expect(res).toEqual([{ userId: 2 }]);
  });

  it('approveRequest - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(approveRequest(1, 2, 3)).resolves.toBeUndefined();
  });

  it('rejectRequest - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(rejectRequest(1, 2, 3)).resolves.toBeUndefined();
  });

  it('unassignAchievement - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(unassignAchievement(1, 1, 1)).resolves.toBeUndefined();
  });

  it('unassignAchievement - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: false,
        text: () => Promise.resolve('Unassign failed'),
      })
    ));
    await expect(unassignAchievement(1, 1, 1)).rejects.toThrow('Unassign failed');
  });

  it('fetchAllAchievements - failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: false })));
    await expect(fetchAllAchievements()).rejects.toThrow('Failed to fetch achievements');
  });

  // === FRIENDS ===
  it('sendFriendRequest - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(sendFriendRequest({ senderId: 1, receiverId: 2 })).resolves.toBeUndefined();
  });

  it('acceptFriendRequest - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(acceptFriendRequest(1)).resolves.toBeUndefined();
  });

  it('declineFriendRequest - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(declineFriendRequest(1)).resolves.toBeUndefined();
  });

  it('removeFriend - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true })));
    await expect(removeFriend(1)).resolves.toBeUndefined();
  });

  it('fetchMyFriends - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([mockUser]) })));
    const res = await fetchMyFriends(1);
    expect(res).toEqual([mockUser]);
  });

  it('fetchFriendRequests - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([mockUser]) })));
    const res = await fetchFriendRequests(1);
    expect(res).toEqual([mockUser]);
  });

  it('searchUsers - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([mockUser]) })));
    const res = await searchUsers('test', 1);
    expect(res).toEqual([mockUser]);
  });

  it('fetchUserById - success', async () => {
    vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockUser) })));
    const res = await fetchUserById(1);
    expect(res).toEqual(mockUser);
  });
});
