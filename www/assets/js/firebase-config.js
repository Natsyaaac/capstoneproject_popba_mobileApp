/**
 * @fileOverview Firebase Configuration and Utilities
 * @description Setup Firebase for image storage in Balloon Pop Maths Visual Mode
 * @description Supports Web, Electron, and Cordova platforms
 * @version 2.0.0
 */
/*jshint esversion: 8 */

let firebaseApp = null;
let firebaseStorage = null;
let firebaseInitialized = false;
let pendingDeletions = [];
const PENDING_DELETIONS_KEY = 'balloon_pop_pending_firebase_deletions';

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

function isFirebaseConfigured() {
    return firebaseConfig.apiKey && 
           firebaseConfig.storageBucket && 
           firebaseConfig.projectId;
}

function getCurrentPlatform() {
    if (window.PlatformService) {
        return window.PlatformService.getPlatform();
    }
    if (window.cordova) return 'cordova';
    if (typeof process !== 'undefined' && process.versions && process.versions.electron) return 'electron';
    return 'web';
}

function isOnline() {
    if (window.OfflineService) {
        return window.OfflineService.isOnline();
    }
    return navigator.onLine;
}

async function loadFirebaseSDK() {
    const platform = getCurrentPlatform();
    
    if (platform === 'electron') {
        try {
            if (window.firebaseModules) {
                return window.firebaseModules;
            }
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
            const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js');
            return { initializeApp, getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll };
        } catch (error) {
            console.warn('Firebase SDK load failed in Electron:', error);
            return null;
        }
    } else if (platform === 'cordova') {
        try {
            if (window.firebase) {
                return {
                    initializeApp: window.firebase.initializeApp,
                    getStorage: window.firebase.storage,
                    ref: (storage, path) => storage.ref(path),
                    uploadBytes: async (ref, file, metadata) => {
                        const snapshot = await ref.put(file, metadata);
                        return snapshot;
                    },
                    getDownloadURL: async (ref) => await ref.getDownloadURL(),
                    deleteObject: async (ref) => await ref.delete(),
                    listAll: async (ref) => await ref.listAll()
                };
            }
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
            const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js');
            return { initializeApp, getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll };
        } catch (error) {
            console.warn('Firebase SDK load failed in Cordova:', error);
            return null;
        }
    } else {
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
        const { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-storage.js');
        return { initializeApp, getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll };
    }
}

async function initializeFirebase() {
    if (firebaseInitialized) return true;
    
    if (!isFirebaseConfigured()) {
        console.warn('Firebase not configured. Visual questions will use local storage only.');
        return false;
    }
    
    try {
        const sdk = await loadFirebaseSDK();
        if (!sdk) {
            console.warn('Firebase SDK not available for this platform');
            return false;
        }
        
        firebaseApp = sdk.initializeApp(firebaseConfig);
        firebaseStorage = sdk.getStorage(firebaseApp);
        firebaseInitialized = true;
        
        console.log('Firebase initialized successfully');
        
        loadPendingDeletions();
        processPendingDeletions();
        
        return true;
    } catch (error) {
        console.error('Firebase initialization failed:', error);
        return false;
    }
}

function loadPendingDeletions() {
    try {
        const stored = localStorage.getItem(PENDING_DELETIONS_KEY);
        if (stored) {
            pendingDeletions = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error loading pending deletions:', e);
        pendingDeletions = [];
    }
}

function savePendingDeletions() {
    try {
        localStorage.setItem(PENDING_DELETIONS_KEY, JSON.stringify(pendingDeletions));
    } catch (e) {
        console.error('Error saving pending deletions:', e);
    }
}

function addPendingDeletion(imageUrl, storagePath) {
    const deletion = {
        imageUrl: imageUrl,
        storagePath: storagePath,
        addedAt: Date.now(),
        attempts: 0
    };
    pendingDeletions.push(deletion);
    savePendingDeletions();
    console.log('Added pending deletion for:', storagePath);
}

async function processPendingDeletions() {
    if (!isOnline() || pendingDeletions.length === 0) {
        return;
    }
    
    console.log('Processing', pendingDeletions.length, 'pending Firebase deletions...');
    
    const toProcess = [...pendingDeletions];
    const stillPending = [];
    
    for (const deletion of toProcess) {
        deletion.attempts++;
        
        try {
            const success = await deleteFromFirebaseStorage(deletion.storagePath);
            if (success) {
                console.log('Successfully deleted from Firebase:', deletion.storagePath);
            } else {
                if (deletion.attempts < 5) {
                    stillPending.push(deletion);
                } else {
                    console.warn('Max attempts reached for deletion:', deletion.storagePath);
                }
            }
        } catch (error) {
            console.error('Error processing deletion:', error);
            if (deletion.attempts < 5) {
                stillPending.push(deletion);
            }
        }
    }
    
    pendingDeletions = stillPending;
    savePendingDeletions();
}

async function deleteFromFirebaseStorage(storagePath) {
    if (!firebaseInitialized) {
        const initialized = await initializeFirebase();
        if (!initialized) return false;
    }
    
    try {
        const sdk = await loadFirebaseSDK();
        if (!sdk) return false;
        
        const storageRef = sdk.ref(firebaseStorage, storagePath);
        await sdk.deleteObject(storageRef);
        return true;
    } catch (error) {
        if (error.code === 'storage/object-not-found') {
            console.log('Image already deleted from Firebase:', storagePath);
            return true;
        }
        throw error;
    }
}

function extractStoragePathFromUrl(imageUrl) {
    if (!imageUrl || !imageUrl.includes('firebase')) {
        return null;
    }
    
    try {
        const match = imageUrl.match(/\/o\/([^?]+)/);
        if (match && match[1]) {
            return decodeURIComponent(match[1]);
        }
    } catch (e) {
        console.error('Error extracting storage path:', e);
    }
    
    return null;
}

async function uploadImageToFirebase(file, questionId) {
    if (!isOnline()) {
        console.log('Offline: Using local storage for image');
        return null;
    }
    
    if (!firebaseInitialized) {
        const initialized = await initializeFirebase();
        if (!initialized) {
            console.log('Using local storage for image (Firebase not available)');
            return null;
        }
    }
    
    try {
        const sdk = await loadFirebaseSDK();
        if (!sdk) return null;
        
        const timestamp = Date.now();
        const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `visual-questions/${questionId}_${timestamp}_${safeFileName}`;
        const storageRef = sdk.ref(firebaseStorage, fileName);
        
        const metadata = {
            contentType: file.type,
            customMetadata: {
                'questionId': questionId.toString(),
                'uploadedAt': new Date().toISOString(),
                'platform': getCurrentPlatform()
            }
        };
        
        const snapshot = await sdk.uploadBytes(storageRef, file, metadata);
        const downloadURL = await sdk.getDownloadURL(snapshot.ref);
        
        console.log('Image uploaded to Firebase:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Firebase upload failed:', error);
        return null;
    }
}

async function deleteImageFromFirebase(imageUrl) {
    if (!imageUrl) {
        return false;
    }
    
    const storagePath = extractStoragePathFromUrl(imageUrl);
    if (!storagePath) {
        console.log('Not a Firebase URL, skipping deletion');
        return false;
    }
    
    if (!isOnline()) {
        console.log('Offline: Queuing Firebase deletion for later');
        addPendingDeletion(imageUrl, storagePath);
        return true;
    }
    
    if (!firebaseInitialized) {
        const initialized = await initializeFirebase();
        if (!initialized) {
            addPendingDeletion(imageUrl, storagePath);
            return true;
        }
    }
    
    try {
        const success = await deleteFromFirebaseStorage(storagePath);
        if (success) {
            console.log('Image deleted from Firebase:', storagePath);
        }
        return success;
    } catch (error) {
        console.error('Firebase delete failed, queuing for later:', error);
        addPendingDeletion(imageUrl, storagePath);
        return true;
    }
}

async function deleteMultipleImagesFromFirebase(imageUrls) {
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
        return { success: 0, failed: 0, queued: 0 };
    }
    
    const results = { success: 0, failed: 0, queued: 0 };
    
    for (const url of imageUrls) {
        try {
            const deleted = await deleteImageFromFirebase(url);
            if (deleted) {
                if (!isOnline()) {
                    results.queued++;
                } else {
                    results.success++;
                }
            } else {
                results.failed++;
            }
        } catch (error) {
            console.error('Error deleting image:', url, error);
            results.failed++;
        }
    }
    
    return results;
}

function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    
    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: 'Format file tidak didukung. Gunakan JPG, JPEG, PNG, GIF, atau WebP.'
        };
    }
    
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'Ukuran file terlalu besar. Maksimal 5MB.'
        };
    }
    
    return { valid: true };
}

function isFirebaseUrl(url) {
    return url && (
        url.includes('firebasestorage.googleapis.com') ||
        url.includes('firebase') ||
        url.includes(firebaseConfig.storageBucket)
    );
}

function getStorageStats() {
    return {
        initialized: firebaseInitialized,
        configured: isFirebaseConfigured(),
        pendingDeletions: pendingDeletions.length,
        platform: getCurrentPlatform(),
        online: isOnline()
    };
}

if (window.OfflineService) {
    window.OfflineService.addListener(function(status) {
        if (status === 'online') {
            processPendingDeletions();
        }
    });
}

window.firebaseUtils = {
    initializeFirebase,
    uploadImageToFirebase,
    deleteImageFromFirebase,
    deleteMultipleImagesFromFirebase,
    convertFileToBase64,
    validateImageFile,
    isFirebaseConfigured,
    isFirebaseUrl,
    getStorageStats,
    processPendingDeletions,
    extractStoragePathFromUrl
};
