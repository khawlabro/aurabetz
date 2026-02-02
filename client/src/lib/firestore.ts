import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  increment,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// Types
export interface Pick {
  id: string;
  sport: string;
  matchup: string;
  pick: string;
  odds: string;
  confidence: number;
  analysis: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PickWithStatus extends Pick {
  followerCount: number;
  isFollowing: boolean;
}

export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  photoURL: string | null;
  createdAt: Date;
  lastSignedIn: Date;
}

// Collections
const USERS_COLLECTION = 'users';
const PICKS_COLLECTION = 'picks';
const PICK_FOLLOWERS_COLLECTION = 'pickFollowers';

// User operations
export async function upsertUser(userId: string, userData: Partial<UserProfile>) {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      // Update existing user
      await setDoc(userRef, {
        ...userData,
        lastSignedIn: Timestamp.now(),
      }, { merge: true });
    } else {
      // Create new user
      await setDoc(userRef, {
        ...userData,
        createdAt: Timestamp.now(),
        lastSignedIn: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error upserting user:', error);
    throw error;
  }
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        email: data.email || null,
        name: data.name || null,
        photoURL: data.photoURL || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastSignedIn: data.lastSignedIn?.toDate() || new Date(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

// Pick operations
export async function getTodaysPicks(): Promise<Pick[]> {
  try {
    const picksRef = collection(db, PICKS_COLLECTION);
    const q = query(picksRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        sport: data.sport,
        matchup: data.matchup,
        pick: data.pick,
        odds: data.odds,
        confidence: data.confidence,
        analysis: data.analysis,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    });
  } catch (error) {
    console.error('Error getting picks:', error);
    return [];
  }
}

export async function getPicksWithUserStatus(userId: string): Promise<PickWithStatus[]> {
  try {
    const picks = await getTodaysPicks();
    
    // Get all follower counts and user's following status in parallel
    const picksWithStatus = await Promise.all(
      picks.map(async (pick) => {
        const [followerCount, isFollowing] = await Promise.all([
          getPickFollowerCount(pick.id),
          isUserFollowingPick(pick.id, userId),
        ]);
        
        return {
          ...pick,
          followerCount,
          isFollowing,
        };
      })
    );
    
    return picksWithStatus;
  } catch (error) {
    console.error('Error getting picks with user status:', error);
    return [];
  }
}

// Pick follower operations
export async function getPickFollowerCount(pickId: string): Promise<number> {
  try {
    const followersRef = collection(db, PICK_FOLLOWERS_COLLECTION);
    const q = query(followersRef, where('pickId', '==', pickId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.size;
  } catch (error) {
    console.error('Error getting follower count:', error);
    return 0;
  }
}

export async function isUserFollowingPick(pickId: string, userId: string): Promise<boolean> {
  try {
    const followerRef = doc(db, PICK_FOLLOWERS_COLLECTION, `${userId}_${pickId}`);
    const followerDoc = await getDoc(followerRef);
    
    return followerDoc.exists();
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

export async function followPick(pickId: string, userId: string): Promise<{ success: boolean; followerCount: number }> {
  try {
    const followerRef = doc(db, PICK_FOLLOWERS_COLLECTION, `${userId}_${pickId}`);
    const followerDoc = await getDoc(followerRef);
    
    if (followerDoc.exists()) {
      return {
        success: false,
        followerCount: await getPickFollowerCount(pickId),
      };
    }
    
    await setDoc(followerRef, {
      pickId,
      userId,
      followedAt: Timestamp.now(),
    });
    
    return {
      success: true,
      followerCount: await getPickFollowerCount(pickId),
    };
  } catch (error) {
    console.error('Error following pick:', error);
    return {
      success: false,
      followerCount: 0,
    };
  }
}

export async function unfollowPick(pickId: string, userId: string): Promise<{ success: boolean; followerCount: number }> {
  try {
    const followerRef = doc(db, PICK_FOLLOWERS_COLLECTION, `${userId}_${pickId}`);
    await deleteDoc(followerRef);
    
    return {
      success: true,
      followerCount: await getPickFollowerCount(pickId),
    };
  } catch (error) {
    console.error('Error unfollowing pick:', error);
    return {
      success: false,
      followerCount: 0,
    };
  }
}

// Admin: Add a new pick (you'll need to create an admin interface or script for this)
export async function addPick(pickData: Omit<Pick, 'id' | 'createdAt' | 'updatedAt'>): Promise<string | null> {
  try {
    const picksRef = collection(db, PICKS_COLLECTION);
    const newPickRef = doc(picksRef);
    
    await setDoc(newPickRef, {
      ...pickData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    
    return newPickRef.id;
  } catch (error) {
    console.error('Error adding pick:', error);
    return null;
  }
}
