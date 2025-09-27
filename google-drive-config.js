// Google Drive API Configuration
// This file contains the configuration and functions for Google Drive integration

export const GOOGLE_DRIVE_CONFIG = {
    // Get these from Google Cloud Console
    API_KEY: 'AIzaSyD72yHYouFKTzSDo-jvsSSutO0WpeYjCxA', // Your actual API key from Google Cloud Console
    CLIENT_ID: '627031313161-dg698a12h7dvog9ovdcn794i845b86ud.apps.googleusercontent.com', // Your OAuth 2.0 Client ID
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    SCOPES: 'https://www.googleapis.com/auth/drive.file',
    
    // Folder structure in Google Drive
    FOLDERS: {
        ROOT: 'GRC-MLALAF-Scholarship-Applications',
        GUEST: 'Guest-Applications',
        AUTHENTICATED: 'Authenticated-Applications'
    }
};

// Google Drive API wrapper class
export class GoogleDriveService {
    constructor() {
        this.isInitialized = false;
        this.isSignedIn = false;
        this.folderIds = {};
    }

    async initialize() {
        try {
            console.log('🔄 Starting Google Drive API initialization...');
            
            // Load Google APIs with timeout
            await this.loadGoogleAPIs();
            
            // Initialize the Google Drive API using Promise wrapper with timeout
            await new Promise((resolve, reject) => {
                const initTimeout = setTimeout(() => {
                    reject(new Error('Google Drive API initialization timeout'));
                }, 15000); // 15 second timeout
                
                console.log('📦 Loading gapi client and auth2...');
                gapi.load('client:auth2', async () => {
                    try {
                        console.log('🔧 Initializing Google Drive client...');
                        await gapi.client.init({
                            apiKey: GOOGLE_DRIVE_CONFIG.API_KEY,
                            clientId: GOOGLE_DRIVE_CONFIG.CLIENT_ID,
                            discoveryDocs: [GOOGLE_DRIVE_CONFIG.DISCOVERY_DOC],
                            scope: GOOGLE_DRIVE_CONFIG.SCOPES
                        });
                        
                        clearTimeout(initTimeout);
                        this.isInitialized = true;
                        console.log('✅ Google Drive API initialized successfully');
                        
                        // Create folder structure (but don't let it block initialization)
                        this.createFolderStructure().catch(error => {
                            console.warn('⚠️ Folder creation failed:', error);
                        });
                        
                        resolve();
                    } catch (error) {
                        clearTimeout(initTimeout);
                        console.error('❌ Google Drive client initialization failed:', error);
                        reject(error);
                    }
                }, (error) => {
                    clearTimeout(initTimeout);
                    console.error('❌ Failed to load gapi client:', error);
                    reject(new Error('Failed to load Google API client'));
                });
            });
            
        } catch (error) {
            console.error('❌ Google Drive API initialization failed:', error);
            throw error;
        }
    }

    loadGoogleAPIs() {
        return new Promise((resolve, reject) => {
            if (typeof gapi !== 'undefined') {
                console.log('✅ Google API already loaded');
                resolve();
                return;
            }

            console.log('📥 Loading Google API script...');
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            
            const timeout = setTimeout(() => {
                reject(new Error('Google API script loading timeout'));
            }, 10000); // 10 second timeout
            
            script.onload = () => {
                clearTimeout(timeout);
                console.log('✅ Google API script loaded');
                resolve();
            };
            
            script.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('Failed to load Google API script'));
            };
            
            document.head.appendChild(script);
        });
    }

    async signIn() {
        if (!this.isInitialized) {
            throw new Error('Google Drive API not initialized');
        }

        try {
            const authInstance = gapi.auth2.getAuthInstance();
            if (!authInstance.isSignedIn.get()) {
                console.log('Requesting Google Drive sign-in...');
                await authInstance.signIn();
            }
            this.isSignedIn = true;
            console.log('✅ Successfully signed in to Google Drive');
            return true;
        } catch (error) {
            console.error('❌ Error signing in to Google Drive:', error);
            // Don't throw error, allow fallback
            return false;
        }
    }

    async createFolderStructure() {
        try {
            // Create root folder
            const rootFolderId = await this.createFolder(GOOGLE_DRIVE_CONFIG.FOLDERS.ROOT);
            this.folderIds.root = rootFolderId;
            
            // Create guest applications folder
            const guestFolderId = await this.createFolder(
                GOOGLE_DRIVE_CONFIG.FOLDERS.GUEST, 
                rootFolderId
            );
            this.folderIds.guest = guestFolderId;
            
            // Create authenticated applications folder
            const authenticatedFolderId = await this.createFolder(
                GOOGLE_DRIVE_CONFIG.FOLDERS.AUTHENTICATED, 
                rootFolderId
            );
            this.folderIds.authenticated = authenticatedFolderId;
            
            console.log('Folder structure created:', this.folderIds);
        } catch (error) {
            console.error('Error creating folder structure:', error);
        }
    }

    async createFolder(name, parentId = null) {
        try {
            const metadata = {
                name: name,
                mimeType: 'application/vnd.google-apps.folder'
            };
            
            if (parentId) {
                metadata.parents = [parentId];
            }

            const response = await gapi.client.drive.files.create({
                resource: metadata
            });
            
            console.log(`Created folder "${name}" with ID: ${response.result.id}`);
            return response.result.id;
        } catch (error) {
            // If folder already exists, find and return its ID
            if (error.status === 409) {
                return await this.findFolder(name, parentId);
            }
            throw error;
        }
    }

    async findFolder(name, parentId = null) {
        try {
            let query = `name='${name}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
            if (parentId) {
                query += ` and '${parentId}' in parents`;
            }

            const response = await gapi.client.drive.files.list({
                q: query,
                fields: 'files(id, name)'
            });

            if (response.result.files.length > 0) {
                return response.result.files[0].id;
            }
            
            // If not found, create it
            return await this.createFolder(name, parentId);
        } catch (error) {
            console.error('Error finding folder:', error);
            throw error;
        }
    }

    async uploadFile(file, fileName, applicationId, isGuest = false) {
        try {
            if (!this.isInitialized) {
                await this.initialize();
            }

            // Ensure gapi.client.drive is available
            if (!gapi.client.drive) {
                throw new Error('Google Drive API client not properly loaded');
            }

            // Sign in if not already signed in
            if (!this.isSignedIn) {
                const signInSuccess = await this.signIn();
                if (!signInSuccess) {
                    throw new Error('Google Drive authentication required');
                }
            }

            // Create application-specific folder
            const parentFolderId = isGuest ? this.folderIds.guest : this.folderIds.authenticated;
            const appFolderId = await this.createFolder(applicationId, parentFolderId);

            // Prepare file metadata
            const metadata = {
                name: fileName,
                parents: [appFolderId]
            };

            // Choose upload method based on file size
            const MAX_MULTIPART_SIZE = 1024 * 1024; // 1MB
            let response;

            if (file.size <= MAX_MULTIPART_SIZE) {
                // Use multipart upload for files <= 1MB
                response = await this.uploadSmallFile(file, metadata);
            } else {
                // Use resumable upload for files > 1MB
                response = await this.uploadLargeFile(file, metadata);
            }

            const fileId = response.result ? response.result.id : response.id;

            // Make file publicly viewable
            await this.makeFilePublic(fileId);

            // Return file info
            return {
                fileId: fileId,
                fileName: fileName,
                viewUrl: `https://drive.google.com/file/d/${fileId}/view`,
                downloadUrl: `https://drive.google.com/uc?id=${fileId}&export=download`,
                uploadedAt: new Date().toISOString(),
                originalName: file.name,
                size: file.size,
                type: file.type
            };

        } catch (error) {
            console.error('Error uploading file to Google Drive:', error);
            throw error;
        }
    }

    // Method for small files (multipart upload)
    async uploadSmallFile(file, metadata) {
        const base64Data = await this.fileToBase64(file);
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const requestBody = 
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + file.type + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        const request = gapi.client.request({
            'path': 'https://www.googleapis.com/upload/drive/v3/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/related; boundary="' + boundary + '"'
            },
            'body': requestBody
        });

        return await request;
    }

    // Method for large files (resumable upload)
    async uploadLargeFile(file, metadata) {
        return new Promise((resolve, reject) => {
            // First, initiate the resumable upload session
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable');
            xhr.setRequestHeader('Authorization', `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const uploadUrl = xhr.getResponseHeader('Location');
                    this.resumableUpload(file, uploadUrl, resolve, reject);
                } else {
                    reject(new Error(`Failed to initiate resumable upload: ${xhr.statusText}`));
                }
            };
            
            xhr.onerror = () => reject(new Error('Network error during upload initiation'));
            xhr.send(JSON.stringify(metadata));
        });
    }

    // Perform the actual resumable upload
    resumableUpload(file, uploadUrl, resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        
        // Add upload progress tracking
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = (event.loaded / event.total) * 100;
                console.log(`Upload progress: ${percentComplete.toFixed(2)}%`);
                
                // Emit custom event for progress tracking
                window.dispatchEvent(new CustomEvent('driveUploadProgress', {
                    detail: { percent: percentComplete, loaded: event.loaded, total: event.total }
                }));
            }
        };
        
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`));
            }
        };
        
        xhr.onerror = () => reject(new Error('Network error during file upload'));
        xhr.send(file);
    }

    // Add method to handle upload progress
    setupUploadProgressListener(onProgress) {
        window.addEventListener('driveUploadProgress', (event) => {
            if (onProgress && typeof onProgress === 'function') {
                onProgress(event.detail);
            }
        });
    }

    async makeFilePublic(fileId) {
        try {
            await gapi.client.drive.permissions.create({
                fileId: fileId,
                resource: {
                    role: 'reader',
                    type: 'anyone'
                }
            });
        } catch (error) {
            console.warn('Could not make file public:', error);
        }
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    }

    async deleteFile(fileId) {
        try {
            await gapi.client.drive.files.delete({
                fileId: fileId
            });
            console.log(`File ${fileId} deleted successfully`);
            return true;
        } catch (error) {
            console.error('Error deleting file:', error);
            throw error;
        }
    }

    async listFiles(folderId) {
        try {
            const response = await gapi.client.drive.files.list({
                q: `'${folderId}' in parents and trashed=false`,
                fields: 'files(id, name, size, createdTime, mimeType)'
            });
            
            return response.result.files;
        } catch (error) {
            console.error('Error listing files:', error);
            throw error;
        }
    }
}

// Alternative implementation without requiring user sign-in for uploads
// This uses a service account approach (more complex setup but better UX)
export class GoogleDriveServiceAccount {
    constructor() {
        this.serviceAccount = null;
    }

    // This would require server-side implementation
    // The frontend would send files to your server, which then uploads to Google Drive
    async uploadFileViaServer(file, fileName, applicationId, isGuest = false) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('fileName', fileName);
            formData.append('applicationId', applicationId);
            formData.append('isGuest', isGuest);

            const response = await fetch('/api/upload-to-drive', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error uploading via server:', error);
            throw error;
        }
    }
}